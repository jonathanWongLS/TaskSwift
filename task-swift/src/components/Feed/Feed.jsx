import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { FaCircle } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";

import "./Feed.css";

const Feed = () => {
  return (
    <Card className="feed-card" style={{ height: '400px', overflowY: 'auto' }}>
        <Card.Body className="feed-card-body">
            <Card.Title className="feed-card-title">
                <div className="feed-title-container">
                    Feed{' '}
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id="tooltip-top">
                                <p className="feed-tooltip"><FaCircle className="comments-circle" />{' '}Comments</p>
                                <p className="feed-tooltip"><FaCircle className="new-circle" />{' '}New</p>
                                <p className="feed-tooltip"><FaCircle className="updates-circle" />{' '}Updates</p>
                            </Tooltip>
                        }
                    >
                        <div className="feed-help-container">
                            <FaRegQuestionCircle className="feed-help"/>
                        </div>
                    </OverlayTrigger>
                </div>
            </Card.Title>
            <Card.Text>
                {
                    [
                        ["User 1", "Added a comment in Project 1", 0],
                        ["User 2", "Added a task in Project 2", 1],
                        ["User 3", "Changed a task's description in Project 2", 2],
                        ["User 3", "Changed a task's description in Project 2", 2],
                        ["User 3", "Changed a task's description in Project 2", 2]
                    ].map((feedDetails, key) => {
                        return(
                            <div key={key} className={`feed-item ${feedDetails[2] === 0 ? 'comment' : feedDetails[2] === 1 ? 'new' : 'updates'}`}>
                                <div className="feed-item-top">
                                    <h5>{feedDetails[0]}</h5>
                                </div>
                                <div className="feed-item-bottom">
                                    <p>
                                        {feedDetails[1]}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                }
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Feed