using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcPlayground.Models
{
    public class Parent
    {
        public ChildA A { get; set; }
        public ChildB B { get; set; }
    }

    public class ChildA
    {
        public int? Num { get; set; }
        public bool Is { get; set; }
    }

    public class ChildB
    {
        public int Num { get; set; }
        public string Text { get; set; }
    }
}