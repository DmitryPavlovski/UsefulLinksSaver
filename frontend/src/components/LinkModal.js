import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import axios from "axios";

export default class LinkModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            groupList: []
        };
    }
    handleChange = e => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };
    renderGroupList = () => {
        return this.state.groupList.map(item => (
            <option key={item.id} value={item.id}>{item.title}</option>
        ));
    }
    componentDidMount() {
        axios
            .get("api/groups_links/")
            .then(res => this.setState({ groupList: res.data.sort(item => { return new Date() - new Date(item.createdOn) }) }))
            .catch(err => console.log(err));
    };
    render() {
        const { toggle, onSave } = this.props;
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}> link Item </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="url">Url</Label>
                            <Input
                                type="text"
                                name="url"
                                value={this.state.activeItem.url}
                                onChange={this.handleChange}
                                placeholder="Enter url"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={this.state.activeItem.title}
                                onChange={this.handleChange}
                                placeholder="Enter link Title"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={this.state.activeItem.description}
                                onChange={this.handleChange}
                                placeholder="Enter link description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="groupId">Group</Label>
                            <select value={this.state.activeItem.groupId || ""}
                                name="groupId"
                                onChange={this.handleChange}
                                placeholder="Choose group"
                                className="custom-select custom-select-sm">
                                {this.renderGroupList()}
                                <option value="">----</option>
                            </select>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                        Save
          </Button>
                </ModalFooter>
            </Modal>
        );
    }
}