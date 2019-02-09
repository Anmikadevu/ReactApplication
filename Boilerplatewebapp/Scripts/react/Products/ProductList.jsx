
import React, { Component } from 'react';

import {  Button } from 'semantic-ui-react';
import DeleteProduct from './DeleteProduct.jsx';
import CreateProduct from './CreateProduct.jsx'
import UpdateProduct from './UpdateProduct.jsx';


export default class ProductTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ProductList: [],
            Success: { Data: '' },

            showDeleteModal: false,
            deleteId: 0,

            showCreateModel: false,

           ProductId: '',
           ProductName: '',
           ProductPrice: '',

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

    // to get products
    loadData() {

        $.ajax({
            url: "/Products/Listproducts",
            type: "GET",
            success: function (data) { this.setState({ ProductList: data }) }.bind(this)
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
            url: "/Products/EditProducts",
            type: "GET",
            data: { 'id': id },
            success: function (data) { this.setState({ ProductId: data.Id, ProductName: data.Name, ProductPrice: data.Price})
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
        if (!this.state.ProductName) {
            formIsValid = false;
            errors['ProductName'] = '*Please enter the product Name.';
        }

              if (!this.state.ProductPrice) {
            formIsValid = false;
            errors['ProductPrice'] = '*Please enter the price of the product.';
        }

        if (typeof this.state.ProductPrice !== "undefined") {
            if (!this.state.ProductPrice.match(/^\d+(\.\d{1,2})?$/)) {
                formIsValid = false;
                errors["ProductPrice"] = "*Please enter numbers only.";
            }
        }

        this.setState({
            errors: errors
        });
        return formIsValid
    }

    onUpdateSubmit() {
        if (this.validateForm()) {

            let data = { 'Id': this.state.ProductId, 'Name': this.state.ProductName, 'Address': this.state.ProductPrice };

            $.ajax({
                url: "/Products/UpdateProduct",
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
        let list = this.state.ProductList;
        let tableData = null;
        if (list != "") {
            tableData = list.map(product =>
                <tr key={product.Id}>
                    <td className="four wide">{product.Name}</td>
                    <td className="four wide">{product.Price}</td>

                    <td className="four wide">
                        <Button onClick={this.showUpdateModel.bind(this, product.Id)}><i className="edit icon"></i>EDIT</Button>
                    </td>

                    <td className="four wide">
                        <Button onClick={this.handleDelete.bind(this, product.Id)}><i className="trash icon"></i>DELETE</Button>
                    </td>

                </tr>

            )

        }
        return (
            <React.Fragment>
                <div>
                    <div><Button primary onClick={this.showCreateModel}>New Product</Button></div>
                    <CreateProduct onChange={this.onChange} onClose={this.closeCreateModel} onCreateSubmit={this.onCreateSubmit} showCreateModel={this.state.showCreateModel} />

                </div>

                <div>
                    <UpdateProduct onChange={this.onChange} update={this.state.updateId} onClose={this.closeUpdateModel} onUpdateSubmit={this.onUpdateSubmit} showUpdateModel={this.state.showUpdateModel} Id={this.state.CustomerId} Name={this.state.CustomerName} Address={this.state.CustomerAddress} errors={this.state.errors} />

                    <DeleteProduct delete={this.state.deleteId} onClose={this.closeDeleteModal} onDeleteSubmit={this.onDeleteSubmit} showDeleteModal={this.state.showDeleteModal} />

                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="four wide">Name</th>
                                <th className="four wide">Price</th>
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

