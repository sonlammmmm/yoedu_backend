package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Room;
import yoot.yoedu_backend.repository.RoomRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Room>>> getRooms() {
        return ResponseEntity.ok(ApiResponse.success("Success", roomRepository.findAll()));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable("id") Long id) {
        Optional<Room> room = roomRepository.findById(id);

        return room.map(value -> ResponseEntity.ok(ApiResponse.success("Success", value))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Room>> create(@RequestBody Room room) {
        return ResponseEntity.ok(ApiResponse.success("Success", roomRepository.save(room)));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Room>> update(@PathVariable("id") Long id, @RequestBody Room room) {
        Optional<Room> existing = roomRepository.findById(id);

        if (existing.isPresent()) {
            room.setId(id);
            return ResponseEntity.ok(ApiResponse.success("Success", roomRepository.save(room)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Room>> delete(@PathVariable Long id) {
        roomRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
