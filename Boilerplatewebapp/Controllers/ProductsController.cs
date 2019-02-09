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
    public class ProductsController : Controller
    {
        private SampleEntities db = new SampleEntities();

        // GET: Products
        public ActionResult Index()
        {
            return View(db.Products.ToList());
        }

        public JsonResult Listproducts()
        {
            try
            {
                var Products = db.Products.ToList();
                return new JsonResult { Data = Products, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Not found any products", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }




        }



       // DELETE product
        public JsonResult ProductDelete(int id)
        {
            try
            {
                var prodcut = db.Products.Where(c => c.Id == id).SingleOrDefault();
                if (prodcut != null)
                {
                    db.Products.Remove(prodcut);
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
        public JsonResult NewProduct(Product product)
        {
            try
            {
                db.Products.Add(product);
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
        public JsonResult EditProducts(int id)
        {
            try
            {
               Product product = db.Products.Where(c =>c.Id == id).SingleOrDefault();
                return new JsonResult { Data = product, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "No product found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
        //Edit customer post
        public JsonResult UpdateProduct(Product product)
        {
            try
            {
                Product p = db.Products.Where(c => c.Id == product.Id).SingleOrDefault();
                p.Name = product.Name;
                p.Price = product.Price;
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
