﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'semantic-ui-react';
import DeleteSales from './DeleteSales.jsx';
import CreateSales  from './CreateSales.jsx';
import UpdateSales from './UpdateSales.jsx';

class SaleTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SaleList: [],
            Success: { Data: '' },

            showDeleteModal: false,
            deleteId: 0,

            showCreateModel: false,

            Id:'',
            ProductId: '',
            StoreId: '',
            CustomerId: '',
            DateSold: '',

            showUpdateModel: false,
            updateId: 0,

            Success: [],
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

        this.DateConverter = this.DateConverter.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    DateConverter(tempdate) {

        var converted = parseInt((tempdate.replace("/Date(", "").replace(")/", "")))

        var temp = new Date(converted)
        var date = (temp.getFullYear() + "/" + ((temp.getMonth())+1) + "/" + temp.getDate())
        return date;

    }

    //Get sales
    loadData() {

        $.ajax({
            url: "/Sales/SalesList",
            type: "GET",
            success: function (data) { 
                       this.setState({ SaleList: data }) 
                                   }.bind(this)
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
        console.log(e.target.value)
        this.setState({ [e.target.name]: e.target.value });
    }

    //Update
    showUpdateModel(id) {
        this.setState({ showUpdateModel: true });
        this.setState({ updateId: id });

        $.ajax({
            url: "/Sales/GetUpdateSale",
            type: "GET",
            data: { 'id': id },
            success: function (data) {
                var obj = JSON.parse(data);
                this.setState({
                    SaleId: obj.Id,
                    CustomerId: obj.CustomerId,
                    ProductId: obj.ProductId,
                    StoreId: obj.StoreId,
                    DateSold: this.DateConverter(obj.DateSold)
                }),
                    console.log("showUpdateModel", obj)
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
        if (!this.state.CustomerId) {
            formIsValid = false;
            errors['CustomerId'] = '*Please select the Customer.';
        }

        if (!this.state.ProductId) {
            formIsValid = false;
            errors['ProductId'] = '*Please select the Product.'
        }

        if (!this.state.StoreId) {
            formIsValid = false;
            errors['StoreId'] = '*Please select the Store.'
        }

        if (!this.state.DateSold) {
            formIsValid = false;
            errors['DateSold'] = '*Please provide the sale date.'
        }

        this.setState({
            errors: errors
        });
        return formIsValid
    }

    onUpdateSubmit() {
        if (this.validateForm()) {
            let data = {
                'Id': this.state.updateId,
                'ProductId': this.state.ProductId,
                'CustomerId': this.state.CustomerId,
                'StoreId': this.state.StoreId,
                'DateSold': this.state.DateSold
            };

            $.ajax({
                url: "/Sales/UpdateSale",
                type: "POST",
                data: data,
                success: function (data) {
                    this.setState({ Success: data })
                    window.location.reload()                        
                    console.log("onUpdateSubmit",data)
                }.bind(this)
            });
        }
    }

    render() {
        let list = this.state.SaleList;
        let tableData = null;
        if (list != "") {
            tableData = list.map(sale =>
                <tr key={sale.Id}>
                    <td className="two wide">{sale.CustomerName}</td>
                    <td className="two wide">{sale.ProductName}</td>
                    <td className="two wide">{sale.StoreName}</td>
                    <td className="two wide">{this.DateConverter(sale.DateSold)}</td>

                    <td className="four wide">
                        <Button className="ui yellow button" onClick={this.showUpdateModel.bind(this, sale.Id)}><i className="edit icon"></i>EDIT</Button>
                    </td>

                    <td className="four wide">
                        <Button className="ui red button" onClick={this.handleDelete.bind(this, sale.Id)}><i className="trash icon"></i>DELETE</Button>
                    </td>

                </tr>

            )

        }
        return (
            <React.Fragment>
                <div>
                    <div><Button primary onClick={this.showCreateModel}>New Sale</Button></div>
                    <CreateSales  onChange={this.onChange} onClose={this.closeCreateModel} onCreateSubmit={this.onCreateSubmit} showCreateModel={this.state.showCreateModel} />

                </div>

                <div>
                    <UpdateSales onChange={this.onChange} update={this.state.updateId} onClose={this.closeUpdateModel} onUpdateSubmit={this.onUpdateSubmit} showUpdateModel={this.state.showUpdateModel}
                        Id={this.state.Id} ProductId={this.state.ProductId} CustomerId={this.state.CustomerId} StoreId={this.state.StoreId} DateSold={this.state.DateSold} errors={this.state.errors} />

                    <DeleteSales delete={this.state.deleteId} onClose={this.closeDeleteModal} onDeleteSubmit={this.onDeleteSubmit} showDeleteModal={this.state.showDeleteModal} />

                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="four wide">Customer</th>
                                <th className="four wide">Product</th>
                                <th className="four wide">Store</th>
                                <th className="four wide">DateSold</th>
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
export default SaleTable;