const memberAPI = "/members"
const membershipAPI = "/memberships"

let memberEditingID = null
let membershipEditingID = null

const lastName = document.querySelector("#lastName")
const firstName = document.querySelector("#firstName") 
const plan = document.querySelector("#plan")
const memberCancelBtn = document.querySelector("#cancelMember")
const memberTitle = document.querySelector("#member-title")

const planName = document.querySelector("#name")
const duration = document.querySelector("#duration")
const rate = document.querySelector("#rate")
const planCancelBtn = document.querySelector("#cancelMembership")
const planTitle = document.querySelector("#plan-title")

const membersTable = document.querySelector(".members.table")
const membershipsTable = document.querySelector(".memberships.table")

const msg = document.querySelector("#msg")

async function loadMembers(){
  const resMembers = await fetch(memberAPI)
  const members = await resMembers.json()
  const resMemberships = await fetch(membershipAPI)
  const memberships = await resMemberships.json()

  membersTable.innerHTML = ""

  members.forEach(member => {
    const matchedPlan = memberships.find(p => p.planName == member.membership)
    const expiryDays = matchedPlan ? matchedPlan.duration : 0
    let currentDate = Date.now() 
    const dateDiff = ((currentDate - new Date (member.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const active = expiryDays > dateDiff
  
    const status = active 
      ? "<span class='active true'> Active </span>"
      : "<span class='active false'> Expired </span>"

    const fullName = `${member.lastName} ${member.firstName}`
    const tr = document.createElement("tr")

    tr.innerHTML = 
      "<td>" + fullName + "</td>" +
      "<td>" + (member.membership || "") + "</td>" +
      "<td>" + (member.attendance ?? 0) + "</td>" +
      "<td>" + status + "</td>" +
      "<td>" +
        "<button class='edit button members'>Edit</button>" +
        "<button class='delete button members'>Delete</button>" +
      "</td>"

    const editButton = tr.querySelector(".edit.button.members")
    const deleteButton = tr.querySelector(".delete.button.members")

    editButton.addEventListener("click", () => startEditMember(member))
    deleteButton.addEventListener("click", () => deleteMember(member._id))

    membersTable.appendChild(tr)
  })
}