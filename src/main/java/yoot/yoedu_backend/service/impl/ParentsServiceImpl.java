package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yoot.yoedu_backend.domain.entity.Parents;
import yoot.yoedu_backend.repository.ParentsRepository;
import yoot.yoedu_backend.service.ParentsService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParentsServiceImpl implements ParentsService {

    private final ParentsRepository parentsRepository;

    public List<Parents> findAll() {
        return parentsRepository.findAll();
    }

    public Optional<Parents> findById(Long id) {
        return parentsRepository.findById(id);
    }

    public Parents save(Parents parents) {
        return parentsRepository.save(parents);
    }

    public void deleteById(Long id) {
        parentsRepository.deleteById(id);
    }
}
