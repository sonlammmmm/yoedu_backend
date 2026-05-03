package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.Parents;

import java.util.List;
import java.util.Optional;

public interface ParentsService {

    List<Parents> findAll();

    Optional<Parents> findById(Long id);

    Parents save(Parents parents);

    void deleteById(Long id);
}
