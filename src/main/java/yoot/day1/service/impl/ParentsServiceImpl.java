package yoot.day1.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yoot.day1.domain.entity.Parents;
import yoot.day1.repository.ParentsRepository;
import yoot.day1.service.ParentsService;

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
