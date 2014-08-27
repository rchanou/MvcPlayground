using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcPlayground.Models;

namespace MvcPlayground.Controllers
{
    [TestClass]
    public class TestController : HomeController
    {
        //
        // GET: /Test/

        [TestMethod]
        public void Testing_Works()
        {
            Assert.AreEqual(1+1, 2);
        }

        [TestMethod]
        public void BoundRecordInfo_Construction_Succeeds()
        {
            var customer = new Customer {ID = 15};
            var boundRecord = new BoundRecordInfo(customer);
            Assert.AreEqual(boundRecord.entityClass, "MvcPlayground.Models.Customer");
            Assert.AreEqual(boundRecord.primaryKey, 15);
        }
    }
}
