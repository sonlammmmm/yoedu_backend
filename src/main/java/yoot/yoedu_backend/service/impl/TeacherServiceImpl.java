package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yoot.yoedu_backend.domain.entity.Teacher;
import yoot.yoedu_backend.repository.TeachersRepository;
import yoot.yoedu_backend.service.TeachersService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeachersService {
    private final TeachersRepository teachersRepository;

    public List<Teacher> findAll() {
        return teachersRepository.findAll();
    }

    public Optional<Teacher> findById(Long id) {
        return teachersRepository.findById(id);
    }

    public Teacher save(Teacher teacher) {
        return teachersRepository.save(teacher);
    }

    public void deleteById(Long id) {
        teachersRepository.deleteById(id);
    }
}
