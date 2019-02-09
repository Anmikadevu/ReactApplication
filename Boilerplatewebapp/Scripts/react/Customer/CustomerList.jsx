﻿
import React, { Component } from 'react';

import {  Button } from 'semantic-ui-react';
import CustomerDelete from './DeleteCustomer.jsx';
import CustomerCreate from './CreateCustomer.jsx';
import CustomerUpdate from './UpdateCustomer.jsx';

export default class CustomerTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CustomerList: [],
            Success: { Data: '' },

            showDeleteModal: false,
            deleteId: 0,

            showCreateModel: false,

            CustomerId: '',
            CustomerName: '',
            CustomerAddress: '',

            showUpdateModel: false,
            updateId: 0,

            Sucess: [],
            errors: {}
        };

        this.loadData = this.loadData.bind(this);

        this.handleDelete = this.handleDelete.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);

        this.showCreateModel = this.showCreateModel.bind(this);
        this.closeCreateModel = this.closeCreateModel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.showUpdateModel = this.showUpdateModel.bind(this);
        this.closeUpdateModel = this.closeUpdateModel.bind(this);
        this.onUpdateSubmit = this.onUpdateSubmit.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    //Get customers
    loadData() {

        $.ajax({
            url: "/Customers/CustomersList",
            type: "GET",
            success: function (data) { this.setState({ CustomerList: data }) }.bind(this)
        });
    }

    //Delete    
    handleDelete(id) {

        this.setState({ showDeleteModal: true });
        this.setState({ deleteId: id });
    }

    closeDeleteModal() {
        this.setState({ showDeleteModal: false });
        window.location.reload()
    }

    //Create
    showCreateModel() {
        this.setState({ showCreateModel: true });
    }

    closeCreateModel() {
        this.setState({ showCreateModel: false });
        window.location.reload()
    }

    onChange(e) {

        this.setState({ [e.target.name]: e.target.value });
    }

    //Update
    showUpdateModel(id) {
        this.setState({ showUpdateModel: true });
        this.setState({ updateId: id });

        $.ajax({
            url: "/Customers/EditCustomer",
            type: "GET",
            data: { 'id': id },
            success: function (data) {
                this.setState({ CustomerId: data.Id, CustomerName: data.Name, CustomerAddress: data.Address })
            }.bind(this)
        });

    }

    closeUpdateModel() {
        this.setState({ showUpdateModel: false });
        window.location.reload()
    }

    validateForm() {

        let errors = {}

        let formIsValid = true
        if (!this.state.CustomerName) {
            formIsValid = false;
            errors['CustomerName'] = '*Please enter the Customer Name.';
        }

        if (typeof this.state.CustomerName !== "undefined") {
            if (!this.state.CustomerName.match(/^[a-zA-Z ]*$/)) {
                formIsValid = false;
                errors["CustomerName"] = "*Please enter alphabet characters only.";
            }
        }

        if (!this.state.CustomerAddress) {
            formIsValid = false;
            errors['CustomerAddress'] = '*Please enter the Customer Address'
        }

        this.setState({
            errors: errors
        });
        return formIsValid
    }

    onUpdateSubmit() {
        if (this.validateForm()) {

            let data = { 'Id': this.state.CustomerId, 'Name': this.state.CustomerName, 'Address': this.state.CustomerAddress };

            $.ajax({
                url: "/Customers/UpdateCustomer",
                type: "POST",
                data: data,
                success: function (data) {
                    this.setState({ Success: data })
                    window.location.reload()
                }.bind(this)
            });
        }
    }

    render() {
        let list = this.state.CustomerList;
        let tableData = null;
        if (list != "") {
            tableData = list.map(customer =>
                <tr key={customer.Id}>
                    <td className="four wide">{customer.Name}</td>
                    <td className="four wide">{customer.Address}</td>

                    <td className="four wide">
                        <Button  onClick={this.showUpdateModel.bind(this, customer.Id)}><i className="edit icon"></i>EDIT</Button>
                    </td>

                    <td className="four wide">
                        <Button  onClick={this.handleDelete.bind(this, customer.Id)}><i className="trash icon"></i>DELETE</Button>
                    </td>

                </tr>

            )

        }
        return (
            <React.Fragment>
                <div>
                    <div><Button primary onClick={this.showCreateModel}>New Customer</Button></div>
                    <CustomerCreate onChange={this.onChange} onClose={this.closeCreateModel} onCreateSubmit={this.onCreateSubmit} showCreateModel={this.state.showCreateModel} />

                </div>

                <div>
                    <CustomerUpdate onChange={this.onChange} update={this.state.updateId} onClose={this.closeUpdateModel} onUpdateSubmit={this.onUpdateSubmit} showUpdateModel={this.state.showUpdateModel} Id={this.state.CustomerId} Name={this.state.CustomerName} Address={this.state.CustomerAddress} errors={this.state.errors} />

                    <CustomerDelete delete={this.state.deleteId} onClose={this.closeDeleteModal} onDeleteSubmit={this.onDeleteSubmit} showDeleteModal={this.state.showDeleteModal} />

                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="four wide">Name</th>
                                <th className="four wide">Address</th>
                                <th className="four wide">Actions</th>
                                <th className="four wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    }
}
