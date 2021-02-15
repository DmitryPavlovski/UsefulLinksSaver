import React, { Component } from "react";
import LinkModal from "./LinkModal";
import { Window } from "react-bootstrap-icons";
import axios from "axios";
import "../css/ContentNavBar.css"

export default class ContentNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddLinkModal: false,
            item: {
                title: "",
                description: "",
                url: "",
                groupId: ""
            }
        };
    };
    handleLinkSubmit = item => {
        this.toggleAddLinkModal();
        this.insertLink(item);
    };
    insertLink = item => {
        axios
            .post("api/links/", item)
            .then(() => this.props.toggleRefreshList());
    };
    toggleAddLinkModal = () => {
        this.setState({ isAddLinkModal: !this.state.isAddLinkModal });
    };
    createLinkItem = () => {
        const item = { ...this.state.item, groupId: this.props.activeGroupId };
        this.setState({ item })
        this.toggleAddLinkModal();
    }
    render() {
        return (
            <div className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container px-0">
                    <div className="row row-button">
                        <div className={`col-3 ${this.props.isContentActive ? "" : "d-none"}`}>
                            <button type="button" id="sidebarCollapse" className={`navbar-btn pl-0 ${this.props.isSidebarActive ? " active" : ""}`} onClick={this.props.sidebarCollapseClick}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                        <div className={`add-button-container ${this.props.isContentActive ? "col-7" : "col-9 px-0 pl-4"}`}>
                            <button onClick={this.createLinkItem} className="navbar-btn btn btn-primary add-button px-2">
                                Add link
                            </button>
                        </div>
                        <div className={`float-sm-right ${this.props.isContentActive ? "col-2" : "col-3 px-0"}`}>
                            <button className="navbar-btn btn" onClick={this.props.closePreview}>
                                <Window />
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.isAddLinkModal ? (
                    <LinkModal
                        activeItem={this.state.item}
                        toggle={this.toggleAddLinkModal}
                        onSave={this.handleLinkSubmit}
                    />
                ) : null}
            </div>
        );
    }
}