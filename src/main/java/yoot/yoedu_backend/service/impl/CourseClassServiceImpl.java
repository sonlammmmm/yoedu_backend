package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.domain.entity.Course;
import yoot.yoedu_backend.domain.entity.CourseClass;
import yoot.yoedu_backend.dto.courseclass.CourseClassResponse;
import yoot.yoedu_backend.dto.courseclass.CourseClassUpsertRequest;
import yoot.yoedu_backend.repository.*;
import yoot.yoedu_backend.service.CourseClassService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseClassServiceImpl implements CourseClassService {

    private final CourseClassRepository courseClassRepository;

    private final ScheduleSlotRepository scheduleSlotRepository;

    private final TeachersRepository teachersRepository;

    private final CourseRepository courseRepository;

    private final RoomRepository roomRepository;

    private final ModelMapper mapper;

    CourseClassResponse toCourseClassResponse(CourseClass cc) {
        return mapper.map(cc, CourseClassResponse.class);
    }

    void copyToCourseClassResponse(CourseClassUpsertRequest req, CourseClass cc) {
        cc.setClassCode(req.getClassCode());
        cc.setName(req.getName());
        cc.setStartDate(req.getStartDate());
        cc.setEndDate(req.getEndDate());
        cc.setTuitionFee(req.getTuitionFee());
        cc.setStatus(req.getStatus());

        Course course = courseRepository.findById(req.getCourseId())
                .orElseThrow(() -> new NotFoundException("Course with id " + req.getCourseId() + " not found"));
        cc.setCourse(course);

        cc.setRoom(roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new NotFoundException("Room with id " + req.getRoomId() + " not found")));

        cc.setSlot(scheduleSlotRepository.findById(req.getScheduleSlotId())
                .orElseThrow(() -> new NotFoundException(
                        "Schedule slot with id " + req.getScheduleSlotId() + " not found")));

        cc.setMainTeacher(teachersRepository.findById(req.getMainTeacherId())
                .orElseThrow(
                        () -> new NotFoundException("Main teacher with id " + req.getMainTeacherId() + " not found")));

        if (req.getAssistantTeacherId() != null) {
            cc.setAssistantTeacher(teachersRepository.findById(req.getAssistantTeacherId())
                    .orElseThrow(() -> new NotFoundException(
                            "Assistant teacher with id " + req.getAssistantTeacherId() + " not found")));
        } else {
            cc.setAssistantTeacher(null);
        }

        // Keep maxStudents consistent with room capacity when possible
        if (cc.getRoom() != null && cc.getRoom().getCapacity() != null) {
            cc.setMaxStudents(cc.getRoom().getCapacity());
        }
    }

    public List<CourseClassResponse> findAll() {
        return courseClassRepository.findAll().stream()
                .map(this::toCourseClassResponse)
                .toList();
    }

    public Optional<CourseClassResponse> findById(Long id) {
        return courseClassRepository.findById(id).map(this::toCourseClassResponse);
    }

    public CourseClassResponse create(CourseClassUpsertRequest req) {
        CourseClass cc = new CourseClass();
        copyToCourseClassResponse(req, cc);

        CourseClass result = courseClassRepository.save(cc);
        return toCourseClassResponse(result);
    }

    public CourseClassResponse update(Long id, CourseClassUpsertRequest req) throws NotFoundException {
        Optional<CourseClass> courseClass = courseClassRepository.findById(id);

        if (courseClass.isPresent()) {
            CourseClass cc = courseClass.get();

            copyToCourseClassResponse(req, cc);

            CourseClass result = courseClassRepository.save(cc);
            return toCourseClassResponse(result);
        } else {
            throw new NotFoundException("Course Class not exists");
        }
    }

    @Transactional(readOnly = true)
    public CourseClass getCourseClass(Long id) throws NotFoundException {
        return courseClassRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Course class not found: " + id));
    }
}
