
export function UserRoles(){
  return [
    "superadmin", "admin", "staff"
  ]
}

export const defaultPages = [
  {
    name: "Home",
    link: "/admin", 
  },
];

export const taskTypes = [
  {
    id: 1, 
    name: "Backlog"
  },
  {
    id: 2, 
    name: "Ready to do"
  },
  {
    id: 3, 
    name: "In progress"
  },
  {
    id: 4, 
    name: "Done"
  },
]