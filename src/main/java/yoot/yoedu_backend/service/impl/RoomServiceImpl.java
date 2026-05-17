package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yoot.yoedu_backend.domain.entity.Room;
import yoot.yoedu_backend.repository.RoomRepository;
import yoot.yoedu_backend.service.RoomService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    @Override
    public Optional<Room> findById(Long id) {
        return roomRepository.findById(id);
    }

    @Override
    public Room save(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public void deleteById(Long id) {
        roomRepository.deleteById(id);
    }
}

