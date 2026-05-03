package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import yoot.yoedu_backend.domain.entity.Student;
import yoot.yoedu_backend.domain.enums.Gender;
import yoot.yoedu_backend.domain.enums.Status;
import yoot.yoedu_backend.dto.parent.ParentResponse;
import yoot.yoedu_backend.dto.student.StudentResponse;
import yoot.yoedu_backend.dto.student.StudentUpsertRequest;
import yoot.yoedu_backend.repository.ParentsRepository;
import yoot.yoedu_backend.repository.StudentRepository;
import yoot.yoedu_backend.service.StudentService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final ParentsRepository parentsRepository;
    private final ModelMapper mapper;

    public List<StudentResponse> findAll() {
        return studentRepository.findAll().stream().map(s -> map(s)).toList();
    }

    private StudentResponse map(Student student) {
        StudentResponse response = mapper.map(student, StudentResponse.class);
        if (student.getParents() != null) {
            ParentResponse parentResponse = mapper.map(student.getParents(), ParentResponse.class);
            parentResponse.setCreated_at(student.getParents().getCreatedAt());
            parentResponse.setUpdated_at(student.getParents().getUpdatedAt());
            response.setParent(parentResponse);
        }
        return response;
    }


    public Optional<StudentResponse> findById(Long id) {
        return studentRepository.findById(id).map(s -> map(s));
    }


    public StudentResponse create(StudentUpsertRequest req) {
        Student stu = mapper.map(req, Student.class);
        parentsRepository.findById(req.getParentId())
                .ifPresent(p -> stu.setParents(p));
        stu.setCreatedAt(LocalDateTime.now());
        stu.setUpdatedAt(LocalDateTime.now());
        Student result = studentRepository.save(stu);

        return map(result);
    }

    public StudentResponse update(Long id, StudentUpsertRequest req){
        Student stu = mapper.map(req, Student.class);
        stu.setId(id);

        parentsRepository.findById(req.getParentId())
                .ifPresent(p -> stu.setParents(p));
        stu.setUpdatedAt(LocalDateTime.now());
        Student result = studentRepository.save(stu);

        return map(result);
    }

    public void deleteById(Long id) throws Exception {
        if (!studentRepository.existsById(id)) {
            throw new Exception("Student not found");
        }
        studentRepository.deleteById(id);
    }
}
