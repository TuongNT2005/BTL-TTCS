export const sideBarItemStyle = 
`
    flex flex-row justify-start items-center rounded-lg gap-[10px] 
    hover:bg-[#e9efff] hover:text-[#4a7afa] 
    pr-5 pl-2 py-1 mt-[5px] 
    md:pr-25 md:pl-5 md:py-1 md:mt-[10px] 
`;

export const textStyle = {
    title: 
    `text-xl md:text-2xl font-bold text-black `,
    subTitle1:
    `text-lg md:text-xl font-medium text-black `,
    subTitle2:
    `text-sm md:text-lg font-medium text-black `,
    content:
    `text-[12px] md:text-sm text-black `
}

export const btnStyle = {
    updateBtn:  `${textStyle.content} bg-sky-500 px-2 py-1 rounded-sm text-white hover:bg-sky-600 cursor-pointer  `,
    deleteBtn:  `${textStyle.content} bg-red-500 px-2 py-1 rounded-sm text-white hover:bg-red-600 cursor-pointer `,
    addBtn:     `${textStyle.content} bg-green-500 px-2 py-1 rounded-sm text-white hover:bg-green-600 cursor-pointer `
}

export const colors = {
    background: {
        main: "bg-[#444444] ",
        sidebar: "bg-[#000000] ",
        sidebarItem_hover: "hover:bg-[#5F43FF] "
    },

    text: {
        normal: "bg-[#FFFFFF] " 
        
    }
}