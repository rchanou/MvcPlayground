using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace MvcPlayground.Models
{
    public class StoreInitializer : DropCreateDatabaseIfModelChanges<StoreContext>
    {
        protected override void Seed(StoreContext context)
        {
            //base.Seed(context);

            var customers = new List<Customer>
            {
                new Customer { FirstName="Jay", LastName="Samuels" },
                new Customer {
                    FirstName="Zoe",
                    LastName="Za", 
                    OrderSet = new List<Order>{ new Order { Price=3, Product="Ham", Units=2.5 } }
                }
            };

            customers.ForEach(c => context.CustomerSet.Add(c));

            context.SaveChanges();
        }
    }
}