package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.Teachers;

import java.util.List;
import java.util.Optional;

public interface TeachersService {
    List<Teachers> findAll();

    Optional<Teachers> findById(Long id);

    Teachers save(Teachers teachers);

    void deleteById(Long id);
}
