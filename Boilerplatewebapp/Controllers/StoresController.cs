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
    public class StoresController : Controller
    {
        private SampleEntities db;

        public StoresController()
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

        // GET Stores
        public JsonResult StoresList()
        {
            try
            {
                var Storelist = db.Stores.ToList();
                return new JsonResult { Data = Storelist, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = " cannot find any stores",JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        // DELETE Store
        public JsonResult DeleteStore(int id)
        {
            try
            {
                var store = db.Stores.Where(s => s.Id == id).SingleOrDefault();
                if (store!= null)
                {
                    db.Stores.Remove(store);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "  Deletion of the store unsuccessfull", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = " successfully deleted the store", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        //New Store
        public JsonResult NewStore(Store store)
        {
            try
            {
                db.Stores.Add(store);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "failed Creation", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Creation successfull", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Edit Store get
        public JsonResult Editstore(int id)
        {
            try
            {
                Store Store = db.Stores.Where(s => s.Id == id).SingleOrDefault();
                return new JsonResult { Data = Store, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Not found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
        //Edit Store post
        public JsonResult UpdateStore(Store Store)
        {
            try
            {
                Store cust = db.Stores.Where(s => s.Id == Store.Id).SingleOrDefault();
                cust.Name = Store.Name;
                cust.Address = Store.Address;
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "failed store updation", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Updated store", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}




