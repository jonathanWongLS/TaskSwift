import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdPersonAdd } from "react-icons/io";

import "./ProjectMembers.css";

const ProjectMemberCard = () => {
    return (
        <div className="member-card-container">
            <div className="member-card-left">
                <FaUserCircle size="2em" color="black" className="member-icon"/>
                <>Danielle</> 
            </div>
            <div className="member-card-right">
                <RiDeleteBin6Line size="1.5em" fill="red" className="remove-member-icon"/>
            </div>
        </div>
    );
}

const ProjectMembers = () => {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    const handleCloseAddMemberModal = () => setShowAddMemberModal(false);
    const handleOpenAddMemberModal = () => setShowAddMemberModal(true);

    return (
        <div className="project-members-container">
            <h4 className="project-members-title">Members</h4>
            <div className="project-members-list">
                <ProjectMemberCard />
                <ProjectMemberCard />
                <ProjectMemberCard />
                <ProjectMemberCard />
            </div>
            <> 
                <Button className="add-member-btn" onClick={ handleOpenAddMemberModal }>
                    <>
                        <IoMdPersonAdd size="1.2em"/>
                    </>
                    <p>Add Member</p>
                </Button>

                <Modal dialogClassName="modal-add-member" show={ showAddMemberModal } onHide={ handleCloseAddMemberModal }>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <h5>Add Project Members</h5>
                                </Form.Label>
                                <Form.Control type="text" placeholder="user@email.com, user2@email.com, ..." />
                                <Form.Text muted>Enter multiple comma-separated email addresses</Form.Text>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                                <Button variant="primary" onClick={ handleCloseAddMemberModal }>
                                    Add Member(s)
                                </Button>
                                <Button variant="danger" onClick={ handleCloseAddMemberModal }>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                </Modal>
            </>
        </div>
    )
}

export default ProjectMembers