using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcPlayground.Models
{
    public class OptionSet
    {
        public bool Priority { get; set; }
    }

    public class Request
    {
        public Customer Customer { get; set; }
        public OptionSet Options { get; set; }
    }
}