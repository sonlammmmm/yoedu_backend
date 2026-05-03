package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yoot.yoedu_backend.domain.entity.Teachers;
import yoot.yoedu_backend.repository.TeachersRepository;
import yoot.yoedu_backend.service.TeachersService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeachersService {
    private final TeachersRepository teachersRepository;

    public List<Teachers> findAll() {
        return teachersRepository.findAll();
    }

    public Optional<Teachers> findById(Long id) {
        return teachersRepository.findById(id);
    }

    public Teachers save(Teachers teachers) {
        return teachersRepository.save(teachers);
    }

    public void deleteById(Long id) {
        teachersRepository.deleteById(id);
    }
}
