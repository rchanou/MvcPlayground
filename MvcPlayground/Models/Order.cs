using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcPlayground.Models
{
    public class Order
    {
        public int ID { get; set; }
        public int? UserID { get; set; }
        public string Product { get; set; }
        public double Units { get; set; }
        public double Price { get; set; }
        public virtual Customer Customer { get; set; }
    }
}