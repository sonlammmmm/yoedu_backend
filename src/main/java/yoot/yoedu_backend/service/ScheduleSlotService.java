package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.ScheduleSlot;

import java.util.List;
import java.util.Optional;

public interface ScheduleSlotService {
    List<ScheduleSlot> findAll();

    Optional<ScheduleSlot> findById(Long id);

    ScheduleSlot save(ScheduleSlot scheduleSlot);

    void deleteById(Long id);
}
