import React from 'react';
import Room from './Room';
import { Link } from 'react-router-dom';
import { ListGroup, Badge } from 'react-bootstrap';

const RoomList = ({ rooms }) => {
    return (
        <ListGroup as="ol" numbered>
            {rooms && rooms.map(room => (
                <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                        <Link to={'/chat/' + room._id + '/' + room.name} key={room._id} style={{ textDecoration: 'none', color: 'black' }}>
                            <Room name={room.name} />
                        </Link>
                    </div>
                    <Badge bg="primary" pill style={{ color: 'white' }}>
                        {room.users.length}
                    </Badge>
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}

export default RoomList
