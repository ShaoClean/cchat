import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomService } from './room.service';
import { RoomEntity } from './room.entity';

describe('RoomService', () => {
    let service: RoomService;
    let repository: Repository<RoomEntity>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomService,
                {
                    provide: getRepositoryToken(RoomEntity),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<RoomService>(RoomService);
        repository = module.get<Repository<RoomEntity>>(getRepositoryToken(RoomEntity));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and save a room', async () => {
            const roomInfo: Partial<RoomEntity> = {
                room_name: 'Test Room',
                password: 'password123',
                number: 1001,
                is_lock: 0,
                level: 1,
                status: 1,
                description: 'Test room description',
            };

            const createdRoom: RoomEntity = {
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                ...roomInfo,
                avatar: null,
                created_time: new Date(),
                updated_time: new Date(),
            } as RoomEntity;

            const savedRoom: RoomEntity = { ...createdRoom };

            mockRepository.create.mockReturnValue(createdRoom);
            mockRepository.save.mockResolvedValue(savedRoom);

            const result = await service.create(roomInfo);

            expect(mockRepository.create).toHaveBeenCalledWith(roomInfo);
            expect(mockRepository.save).toHaveBeenCalledWith(createdRoom);
            expect(result).toEqual(savedRoom);
        });

        it('should create room with minimal required fields', async () => {
            const roomInfo: Partial<RoomEntity> = {
                room_name: 'Minimal Room',
                number: 2001,
            };

            const createdRoom: RoomEntity = {
                uuid: '456e7890-e89b-12d3-a456-426614174001',
                room_name: 'Minimal Room',
                number: 2001,
                password: null,
                is_lock: 0,
                avatar: null,
                level: 0,
                status: 0,
                description: null,
                created_time: new Date(),
                updated_time: new Date(),
            } as RoomEntity;

            mockRepository.create.mockReturnValue(createdRoom);
            mockRepository.save.mockResolvedValue(createdRoom);

            const result = await service.create(roomInfo);

            expect(mockRepository.create).toHaveBeenCalledWith(roomInfo);
            expect(mockRepository.save).toHaveBeenCalledWith(createdRoom);
            expect(result).toEqual(createdRoom);
        });

        it('should handle repository save errors', async () => {
            const roomInfo: Partial<RoomEntity> = {
                room_name: 'Error Room',
                number: 3001,
            };

            const createdRoom: RoomEntity = {
                uuid: '789e1011-e89b-12d3-a456-426614174002',
                ...roomInfo,
            } as RoomEntity;

            mockRepository.create.mockReturnValue(createdRoom);
            mockRepository.save.mockRejectedValue(new Error('Database save error'));

            await expect(service.create(roomInfo)).rejects.toThrow('Database save error');
            expect(mockRepository.create).toHaveBeenCalledWith(roomInfo);
            expect(mockRepository.save).toHaveBeenCalledWith(createdRoom);
        });
    });

    describe('getAll', () => {
        it('should return all rooms', async () => {
            const mockRooms: RoomEntity[] = [
                {
                    uuid: '123e4567-e89b-12d3-a456-426614174000',
                    room_name: 'Room 1',
                    password: null,
                    number: 1001,
                    is_lock: 0,
                    avatar: null,
                    level: 1,
                    status: 1,
                    description: 'First room',
                    created_time: new Date('2024-01-01'),
                    updated_time: new Date('2024-01-01'),
                },
                {
                    uuid: '456e7890-e89b-12d3-a456-426614174001',
                    room_name: 'Room 2',
                    password: 'secret123',
                    number: 1002,
                    is_lock: 1,
                    avatar: 'avatar.jpg',
                    level: 2,
                    status: 1,
                    description: 'Second room',
                    created_time: new Date('2024-01-02'),
                    updated_time: new Date('2024-01-02'),
                },
            ];

            mockRepository.find.mockResolvedValue(mockRooms);

            const result = await service.getAll();

            expect(mockRepository.find).toHaveBeenCalledWith();
            expect(result).toEqual(mockRooms);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no rooms exist', async () => {
            mockRepository.find.mockResolvedValue([]);

            const result = await service.getAll();

            expect(mockRepository.find).toHaveBeenCalledWith();
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should handle repository find errors', async () => {
            mockRepository.find.mockRejectedValue(new Error('Database connection error'));

            await expect(service.getAll()).rejects.toThrow('Database connection error');
            expect(mockRepository.find).toHaveBeenCalledWith();
        });
    });
});