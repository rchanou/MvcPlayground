using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcPlayground.Models
{
    public class Customer
    {
        public Customer()
        {
            this.OrderSet = new List<Order>();
        }

        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public virtual ICollection<Account> AccountSet { get; set; }
        public virtual ICollection<Order> OrderSet { get; set; }
    }
}