export  const VerticalItems = [
    {
        title: "Email",
        icon: "ic:outline-more",
        path:"/"
    },
    {
        title: "Systems",
        icon: "ic:outline-more",

        // path:"/", 
        childrens: [
            {
                title: "Product",
                icon: "ic:outline-more",
                path:"/product",
                childrens: [
                    {
                        title: "Product type",
                        icon: "ic:outline-more",
                        path:"/product-type"
                    }
                ]
            }
        ]

    },  {
        title: "Icon",
        icon: "ic:outline-more",
        path:"/",
        childrens: [
            {
                title: "Icon1",
                icon: "ic:outline-more",
                path:"/"
            }
        ]
    }
]