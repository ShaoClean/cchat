import { CheckCard } from '@ant-design/pro-components';
import { Avatar, Button } from 'antd';

export type RoomEntity = {
    room_name: string;
    number: string;
    password: string;
    avatar: string;
    uuid: string;
    is_lock: number;
    level: number;
    status: number;
    description: string;
    created_time: string;
    updated_time: string;
};
export type RoomListProps = {
    rooms: RoomEntity[] | [];
    onJoin: (room: RoomEntity) => void;
};

const RoomList = (props: RoomListProps) => {
    return (
        <div>
            <CheckCard.Group style={{ width: '100%' }}>
                {props.rooms.map((room: RoomEntity) => (
                    <CheckCard
                        key={room.uuid}
                        extra={
                            <Button type="primary" onClick={() => props?.onJoin(room)}>
                                加入房间
                            </Button>
                        }
                        title={room.room_name}
                        description={room.description}
                        value={room.uuid}
                        avatar={<Avatar src={room.avatar} size="large" />}
                    />
                ))}
            </CheckCard.Group>
        </div>
    );
};

export default RoomList;
