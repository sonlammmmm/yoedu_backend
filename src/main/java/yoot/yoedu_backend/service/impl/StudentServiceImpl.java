package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.domain.entity.Parents;
import yoot.yoedu_backend.domain.entity.Student;
import yoot.yoedu_backend.dto.parent.ParentResponse;
import yoot.yoedu_backend.dto.student.StudentResponse;
import yoot.yoedu_backend.dto.student.StudentUpsertRequest;
import yoot.yoedu_backend.repository.ParentsRepository;
import yoot.yoedu_backend.repository.StudentRepository;
import yoot.yoedu_backend.service.StudentService;

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
        //Kiểm tra tồn tại của parent trước khi gán
        if (req.getParentId() != null) {
        Parents parent = parentsRepository.findById(req.getParentId())
                .orElseThrow(() -> new NotFoundException("Parent with id " + req.getParentId() + " not found"));
        stu.setParents(parent);
        }
        stu.setCreatedAt(LocalDateTime.now());
        stu.setUpdatedAt(LocalDateTime.now());
        Student result = studentRepository.save(stu);

        return map(result);
    }

    public StudentResponse update(Long id, StudentUpsertRequest req){
        Student stu = mapper.map(req, Student.class);
        stu.setId(id);

        //Kiểm tra tồn tại của parent trước khi gán
        if (req.getParentId() != null) {
        Parents parent = parentsRepository.findById(req.getParentId())
                .orElseThrow(() -> new NotFoundException("Parent with id " + req.getParentId() + " not found"));
        stu.setParents(parent);
        }
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
