package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.Teacher;

import java.util.List;
import java.util.Optional;

public interface TeachersService {
    List<Teacher> findAll();

    Optional<Teacher> findById(Long id);

    Teacher save(Teacher teacher);

    void deleteById(Long id);
}
