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

async function loadMemberships(){
  const res = await fetch(membershipAPI)
  const memberships = await res.json()

  membershipsTable.innerHTML = ""

  memberships.forEach(plans => {
    const tr = document.createElement("tr")
  
    tr.innerHTML = 
      "<td>" + plans.planName + "</td>" +
      "<td>" + plans.rate + "</td>" +
      "<td>" + plans.duration + "</td>" +
      "<td>" +
        "<button class='edit button memberships'>Edit</button>" +
        "<button class='delete button memberships'>Delete</button>" +
      "</td>"

    const editButton = tr.querySelector(".edit.button.memberships")
    const deleteButton = tr.querySelector(".delete.button.memberships")

    editButton.addEventListener("click", () => startEditPlan(plans))
    deleteButton.addEventListener("click", () => deletePlan(plans._id))

    membershipsTable.appendChild(tr)
  })
}

async function saveMember(){
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    membership: plan.value,
  }

  let res

  if(memberEditingID === null) {
    res = await fetch(memberAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
  }else {
    res = await fetch(memberAPI + "/" + memberEditingID, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
  }

  if(res.ok) {
    showMsg(memberEditingID === null ? "Member added" : "Member Updated", true)
    resetMemberForm()
    loadMembers()
  }else {
    showMsg("Name is required", false)
  }

}

async function saveMembership(){
  const data = {
    planName: planName.value,
    rate: rate.value,
    duration: duration.value,
  }

  let res

  if(membershipEditingID === null) {
    res = await fetch(membershipAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
  }else {
    res = await fetch(membershipAPI + "/" + membershipEditingID, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
  }

  if(res.ok) {
    showMsg(membershipEditingID === null ? "Membership added" : "Membership Updated", true)
    resetMembershipForm()
    loadMemberships()
  }else {
    showMsg("Name, Duration, and Rate are required", false)
  }

}

async function deleteMember(id){
  await fetch(memberAPI + "/" + id, {method: "DELETE"})
  showMsg("Member Deleted", true)
  loadMembers()
}

async function deletePlan(id){
  await fetch(membershipAPI + "/" + id, {method: "DELETE"})
  showMsg("Membership Deleted", true)
  loadMemberships()
  loadMembers()
}

function startEditMember(member){
  memberEditingID = member._id
  lastName.value = member.lastName
  firstName.value = member.firstName
  plan.value = member.membership
  memberTitle.textContent = "Edit Member"
  memberCancelBtn.style.display = "block"
}

function startEditPlan(plan){
  membershipEditingID = plan._id
  planName.value = plan.planName
  rate.value = plan.rate
  duration.value = plan.duration
  planTitle.textContent = "Edit Membership"
  planCancelBtn.style.display = "block"
}

function resetMemberForm(){
  memberEditingID = null
  lastName.value = ""
  firstName.value = ""
  plan.value = ""
  memberTitle.textContent = "Register Member"
  memberCancelBtn.style.display = "none"
}

function resetMembershipForm(){
  membershipEditingID = null
  planName.value = ""
  Number(rate.value) = 0
  Number(duration.value) = 0
  planTitle.textContent = "Add Membership Plan"
  planCancelBtn.style.display = "none"
}

function showMsg(text, isGood){
  msg.textContent = text
  msg.className = isGood ? "good" : "err"
}

const saveMemberButton = document.querySelector("#saveMember")
const saveMembershipButton = document.querySelector("#saveMembership")

const cancelMemberButton = document.querySelector("#cancelMember")
const cancelMembershipButton = document.querySelector("#cancelMembership")

saveMemberButton.addEventListener("click", saveMember)
saveMembershipButton.addEventListener("click", saveMembership)

cancelMemberButton.addEventListener("click", resetMemberForm)
cancelMembershipButton.addEventListener("click", resetMembershipForm)