import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";

import { FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdPersonAdd } from "react-icons/io";

import axios from 'axios';
import Cookies from 'js-cookie';

import "./ProjectMembers.css";
import AlertBox from "../AlertBox/AlertBox";

const ProjectMemberCard = ({ projectId, projectMemberId, projectMemberName }) => {
    const [showConfirmDeleteMemberModal, setShowConfirmDeleteMemberModal] = useState(false);
    const [confirmDeleteMemberLoading, setConfirmDeleteMemberLoading] = useState(false);
    const [confirmDeleteMemberError, setConfirmDeleteMemberError] = useState(null);

    const handleOpenConfirmDeleteMemberModal = () => setShowConfirmDeleteMemberModal(true);
    const handleCloseConfirmDeleteMemberModal = () => setShowConfirmDeleteMemberModal(false);
    
    const handleDeleteMember = (projectMemberId) => {
        setConfirmDeleteMemberLoading(true);
        axios.delete(
            `https://54.169.240.7:8081/api/v1/project/${projectId}/remove/${projectMemberId}`,
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Cookies.get("jwt")
                }
            }
        ).then((response) => {
            location.reload();
        })
        .catch((error) => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                if (error.response.status == 401) {
                    window.location.href = "/sign-in?expired=true";
                } else {
                    setConfirmDeleteMemberError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                
                setConfirmDeleteMemberError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            } else {
                // Something happened in setting up the request that triggered an error
                
                setConfirmDeleteMemberError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            }
            setTimeout(() => {
                setConfirmDeleteMemberError(null);
            }, 6000);
        })
        .finally(() => {
            setShowConfirmDeleteMemberModal(false);
            setConfirmDeleteMemberLoading(false);
        });
    };
    
    return (
        <div className="member-card-container">
            <AlertBox errorMessage={ confirmDeleteMemberError }/>
            <div className="member-card-left">
                <FaUserCircle size="2em" color="black" className="member-icon"/>
                <>{projectMemberName}</> 
            </div>
            <div className="member-card-right">
                <RiDeleteBin6Line onClick={ () => handleOpenConfirmDeleteMemberModal(true) } size="1.5em" fill="red" className="remove-member-icon" />
            </div>
            <Modal dialogClassName="modal-delete-member" show={ showConfirmDeleteMemberModal } onHide={ handleCloseConfirmDeleteMemberModal }>
                <Modal.Header>
                    <Modal.Title>Remove Member &quot;{ projectMemberName }&quot;</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to remove this member?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ () => handleDeleteMember(projectMemberId) }>
                        I&apos;m sure!
                        {
                            confirmDeleteMemberLoading ? 
                            <span className="d-flex justify-content-center text-align-center">
                                <Spinner animation="grow" size="sm" />
                            </span>
                            : 
                            null 
                        }
                    </Button>
                    <Button variant="danger" onClick={ handleCloseConfirmDeleteMemberModal }>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

const ProjectMembers = ({ projectMembers, projectId }) => {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [addMemberError, setAddMemberError] = useState(null);
    const [emailAddressesToAdd, setEmailAddressesToAdd] = useState('');

    const handleCloseAddMemberModal = () => setShowAddMemberModal(false);
    const handleOpenAddMemberModal = () => setShowAddMemberModal(true);

    const handleEmailAddressesToAddChange = (e) => {
        setEmailAddressesToAdd(e.target.value);
        
    };

    const handleAddMember = () => {
        setAddMemberLoading(true);
        let newProjectAssigneesEmailStr = emailAddressesToAdd.trim();
        let newProjectAssigneesEmailArr = newProjectAssigneesEmailStr.split(",");
        for (let i = 0; i < newProjectAssigneesEmailArr.length; i++) {
            newProjectAssigneesEmailArr[i] = newProjectAssigneesEmailArr[i].trim();
        }

        axios.post(
            `https://54.169.240.7:8081/api/v1/project/${projectId}/assign-users`,
            newProjectAssigneesEmailArr,
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + Cookies.get("jwt")
                }
            }
        ).then((response) => {
            
            location.reload();
        })
        .catch((error) => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                
                if (error.response.status == 401) {
                    window.location.href = "/sign-in?expired=true";
                } else {
                    setAddMemberError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                
                setAddMemberError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            } else {
                // Something happened in setting up the request that triggered an error
                
                setAddMemberError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            }
            setTimeout(() => {
                setAddMemberError(null);
            }, 6000);
        })
        .finally(() => {
            setShowAddMemberModal(false);
            setAddMemberLoading(false);
        });
    }

    return (
        <div className="project-members-container">
            <AlertBox errorMessage={ addMemberError } />
            <h4 className="project-members-title">Members</h4>
            <div className="project-members-list">
                {
                    projectMembers.map((projectMember, index) => {
                        return (
                            <ProjectMemberCard 
                                key={ index }  
                                projectId= { projectId }
                                projectMemberId= { projectMember.id } 
                                projectMemberName= { projectMember.username }
                            />
                        )
                    })
                }
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
                                <Form.Control type="text" placeholder="user@email.com, user2@email.com, ..." value={ emailAddressesToAdd } onChange={ handleEmailAddressesToAddChange } />
                                <Form.Text muted>Enter multiple comma-separated email addresses</Form.Text>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={ handleAddMember }>
                            Add Member(s)
                            {
                                addMemberLoading ? 
                                <span className="d-flex justify-content-center text-align-center">
                                    <Spinner animation="grow" size="sm" />
                                </span>
                                :
                                null
                            }
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

ProjectMemberCard.propTypes = {
    projectId: PropTypes.string.isRequired,
    projectMemberId: PropTypes.number.isRequired,
    projectMemberName: PropTypes.string.isRequired,
}

ProjectMembers.propTypes = {
    projectMembers: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
}

export default ProjectMembers