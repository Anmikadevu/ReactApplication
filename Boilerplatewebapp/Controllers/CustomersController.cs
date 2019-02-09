using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Boilerplatewebapp.Models;

namespace Boilerplatewebapp.Controllers
{
    public class CustomersController : Controller
    {
        private SampleEntities db;

        public CustomersController()
        {
            db = new SampleEntities();
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
        }

        public ActionResult Index()
        {
            return View();
        }

        // GET Customers
        public JsonResult CustomersList()
        {
            try
            {
                var customerList = db.Customers.ToList();     
                    return new JsonResult { Data = customerList, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = " Not Found any customers", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        // DELETE Customer
        public JsonResult CustomerDelete(int id)
        {
            try
            {
                var customer = db.Customers.Where(c => c.Id == id).SingleOrDefault();
                if (customer != null)
                {
                    db.Customers.Remove(customer);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = " unscucessful Deletion", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Successfully Deleted", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

       
        //New customer
        public JsonResult NewCustomer(Customer customer)
        {
            try
            {
                db.Customers.Add(customer);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Customer Create Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Successfully created", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Edit customer get
        public JsonResult EditCustomer(int id)
        {
            try
            {
                Customer customer = db.Customers.Where(c => c.Id == id).SingleOrDefault();
                return new JsonResult { Data = customer, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "No customer found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
        //Edit customer post
        public JsonResult UpdateCustomer(Customer customer)
        {
            try
            {
                Customer cust = db.Customers.Where(c => c.Id == customer.Id).SingleOrDefault();
                cust.Name = customer.Name;
                cust.Address = customer.Address;
                db.SaveChanges(); 
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Updation failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Successfully updated", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}

       
    

