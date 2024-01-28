import Button from "react-bootstrap/Button";

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
            <Button className="add-member-btn">
                <>
                    <IoMdPersonAdd size="1.2em"/>
                </>
                <p>Add Member</p>
            </Button>
        </>
    </div>
  )
}

export default ProjectMembers