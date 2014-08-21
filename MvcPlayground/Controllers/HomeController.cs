using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcPlayground.Models;
using System.Data.Entity.Infrastructure;

namespace MvcPlayground.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            //var viewModel = new StoreContext().CustomerSet.ToList();
            return View(TestComponentTable());
            //return View();
        }

        public JsonResult JsonComponentTable()
        {
            return Json(TestComponentTable(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CustomerTable()
        {
            var customers = new StoreContext().CustomerSet;
            var table = new ComponentTable
            {
                headers = new List<string>{ "ID", "First Name", "Last Name" },
                rows = customers.AsEnumerable().Select(c =>
                {
                    return new ComponentRow
                    {
                        components = new List<component>
                        {
                            new component(new TestCell { text = c.ID.ToString() }),
                            new component(new TextBox { boundRecord = new BoundRecordInfo(c), value = c.FirstName, name = "FirstName" }),
                            new component(new TextBox { boundRecord = new BoundRecordInfo(c), value = c.LastName, name = "LastName" })
                        },
                        record = new BoundRecordInfo(c)
                    };
                }).ToList()
            };
            return Json(table, JsonRequestBehavior.AllowGet);
        }

        public ComponentTable TestComponentTable()
        {
            return new ComponentTable
            {
                rows = new List<ComponentRow>
                {
                    new ComponentRow
                    {
                        components = new List<component>
                        {
                            new component(new TestCell { text = "paz" }),
                            new component(new TestCell { text = "win" })
                        }
                    },
                    new ComponentRow
                    {
                        components = new List<component>
                        {
                            new component(new TestCell { text = "epic" }),
                            new component(new TestCell { text = "zap" })
                        }
                    }
                }
            };
        }


        public JsonResult ListAllCustomers()
        {
            var customers = new StoreContext().CustomerSet;
            return Json(customers, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Test(Customer customer)
        {
            return Json(customer, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Test2(Parent parent)
        {
            return Json(parent, JsonRequestBehavior.AllowGet);
        }

        [Route("bind-test")]
        public JsonResult BindTest(Request request)
        {
            return Json(request);
        }

        public JsonResult ReactifyTest()
        {
            var comboBox = new ComboBox { value = "win" };
            var reactComboBox = new component(comboBox);
            return Json(reactComboBox, JsonRequestBehavior.AllowGet);
        }

        public JsonResult BoundFieldTest(object field)
        {
            return Json(field, JsonRequestBehavior.AllowGet);
        }

        public object GetEntity(string fqn, dynamic primaryKey)
        {
            var context = new StoreContext();
            var type = Type.GetType(fqn);
            var entitySet = context.Set(type);
            var entity = entitySet.Find(primaryKey);
            return entity;
        }
        
        public JsonResult EntityByStringTest()
        {
            var context = new StoreContext();
            var type = Type.GetType("MvcPlayground.Models.Customer");
            var entitySet = context.Set(type);
            var entity = entitySet.Find(2);
            return Json(
                entity,
                JsonRequestBehavior.AllowGet
            );
        }

        public JsonResult BoundRecordTest()
        {
            var customer = new StoreContext().CustomerSet.ToList().Last();
            var boundRecord = new BoundRecordInfo(customer);
            return Json(boundRecord, JsonRequestBehavior.AllowGet);
        }

        public JsonResult RecordUpdateTest()
        {
            var customer = new StoreContext().CustomerSet.First();
            var request = new RecordUpdateRequest
            {
                boundRecord = new BoundRecordInfo(customer),
                fieldToUpdate = "FirstName",
                newValue = "roflrolf"
            };
            var response = request.Submit(DryRun.On);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddCustomer()
        {
            var context = new StoreContext();
            var result = context.CustomerSet.Add(new Customer());
            context.SaveChanges();
            return Json(CustomerTable());
        }

        public JsonResult UpdateBoundRecord(RecordUpdateRequest request)
        {
            var response = request.Submit();
            return Json(response);
        }

        public JsonResult DeleteCustomer(RecordDeleteRequest request)
        {
            if (request.Submit())
            {
                return Json(CustomerTable());
            }
            else
            {
                return Json(new object());
            }
        }

    }
}
