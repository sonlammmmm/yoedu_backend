package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.domain.entity.Teacher;
import yoot.yoedu_backend.dto.teacher.TeacherResponse;
import yoot.yoedu_backend.dto.teacher.TeacherUpsertRequest;
import yoot.yoedu_backend.repository.TeachersRepository;
import yoot.yoedu_backend.service.TeachersService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeachersService {
    private final TeachersRepository teachersRepository;
    private final ModelMapper mapper;

    @Transactional(readOnly = true)
    public List<TeacherResponse> findAll() {
        return teachersRepository.findAll().stream().map(this::map).toList();
    }

    private TeacherResponse map(Teacher teacher) {
        TeacherResponse response = mapper.map(teacher, TeacherResponse.class);
        response.setCreated_at(teacher.getCreatedAt());
        response.setUpdated_at(teacher.getUpdatedAt());
        return response;
    }

    @Transactional(readOnly = true)
    public Optional<TeacherResponse> findById(Long id) {
        return teachersRepository.findById(id).map(this::map);
    }

    @Transactional
    public TeacherResponse create(TeacherUpsertRequest req) {
        Teacher teacher = mapper.map(req, Teacher.class);
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());
        Teacher result = teachersRepository.save(teacher);
        return map(result);
    }

    @Transactional
    public TeacherResponse update(Long id, TeacherUpsertRequest req) {
        Teacher teacher = getTeacher(id);
        mapper.map(req, teacher);
        teacher.setUpdatedAt(LocalDateTime.now());
        Teacher result = teachersRepository.save(teacher);
        return map(result);
    }

    @Transactional
    public void deleteById(Long id) throws Exception {
        if (!teachersRepository.existsById(id)) {
            throw new NotFoundException("Teacher not found");
        }
        teachersRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Teacher getTeacher(Long id) {
        return teachersRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Teacher not found with id: " + id));
    }
}
