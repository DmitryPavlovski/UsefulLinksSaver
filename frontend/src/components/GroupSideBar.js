import React, { Component } from "react";
import AddGroupModal from "./AddGroupModal";
import axios from "axios";
import {PlusCircleFill, PencilSquare, X} from 'react-bootstrap-icons';

export default class GroupSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: {
            title:"",
            id:null
            },
            groupList:[]
        };
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList = () => {
        axios
            .get("api/groups_links/")
            .then(res => this.setState({ groupList: res.data }))
            .catch(err => console.log(err));
    };
    displayGroup = item => {
        this.setState({ activeItem: item });
        const {setGroup} = this.props;
        return setGroup(item);
    };
    renderTabList = () => {

        return (
            <div className="my-5 tab-list">
            {
                this.state.groupList.map(item => (
                <span key={item.id.toString()} className={"list-group-item list-group-item-action bg-light" + this.state.activeItem.id === item.id ? " active" : ""} onClick={() => this.displayGroup(item)}>
                    {item.title}{" "}
                    {this.state.activeItem.id === item.id ? (
                    <div className="d-inline">
                        <PencilSquare onClick={() => this.editGroupItem(item)}/>
                        <X onClick={() => this.handleGroupDelete(item)}/>
                    </div>
                    ) : null}
                    
                </span>
                ))
            }
            <span className={"list-group-item list-group-item-action bg-light" + this.state.activeItem.id === null ? " active" : ""}onClick={() => this.displayGroup({title:"",id:null})}>
                Unsorted
            </span>
            <button className="btn btn-light float-sm-right" onClick={this.createGroupItem}>
                <PlusCircleFill/>
            </button>
            </div>
        );
    };
    toggleAddGroupModal = () => {
        this.setState({ addGroupModal: !this.state.addGroupModal });
    };
    handleGroupSubmit = item => {
        this.toggleAddGroupModal();    
        if (item.id) {
            axios
            .put(`api/groups_links/${item.id}/`, item)
            .then(res => this.refreshList());
            return;
        }
        axios
            .post("api/groups_links/", item)
            .then(res => this.refreshList());
    };
    handleGroupDelete = item => {
        axios
            .delete(`api/groups_links/${item.id}`)
            .then(res => this.refreshList());
    };
    createGroupItem = () => {
        const item = { title: "" };
        this.setState({ activeItem: item, addGroupModal: !this.state.addGroupModal });
    };
    editGroupItem = item => {
        this.setState({ activeItem: item, addGroupModal: !this.state.addGroupModal });
    };
    render() {
        return (
            <div>
                <div className="bg-light border-right" id="sidebar-wrapper">
                    <div className="sidebar-header">
                        <h1 className="text-uppercase my-4">Links app</h1>
                    </div>
                    <div className="list-group list-group-flush">
                        {this.renderTabList()}
                    </div>
                </div>
                {this.state.addGroupModal ? (
                <AddGroupModal
                    activeItem={this.state.activeItem}
                    toggle={this.toggleAddGroupModal}
                    onSave={this.handleGroupSubmit}
                />
            ) : null}
            </div>
        );
    }
}