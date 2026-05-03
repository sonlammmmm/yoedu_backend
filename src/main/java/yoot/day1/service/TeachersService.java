package yoot.day1.service;

import yoot.day1.domain.entity.Teachers;

import java.util.List;
import java.util.Optional;

public interface TeachersService {
    List<Teachers> findAll();

    Optional<Teachers> findById(Long id);

    Teachers save(Teachers teachers);

    void deleteById(Long id);
}
