const memberAPI = "/members"
const membershipAPI = "/memberships"

let memberEditingID = null
let membershipEditingID = null

const lastName = document.querySelector("#lastName")
const firstName = document.querySelector("#firstName") 
const planSelect = document.querySelector("#plan-selection")
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

const searchMembers = document.querySelector("#search-members")
const searchPlans = document.querySelector("#search-plans")

async function loadMembers(searchMembers){
  const resMembers = await fetch(memberAPI)
  const loadedMembers = await resMembers.json()
  const resMemberships = await fetch(membershipAPI)
  const memberships = await resMemberships.json()

  membersTable.innerHTML = ""

  const members = (searchMembers !== undefined) ? searchMembers : loadedMembers
  console.log(members)

  members.forEach(member => {
    const oneDay = 1000 * 60 * 60 * 24
    const matchedPlan = memberships.find(p => p._id === member.membership)
    const expiryDays = matchedPlan ? matchedPlan.duration : 0
    const currentDate = new Date()
    const memberTime = new Date(member.createdAt)
    const dateDiff = (currentDate.getTime() - memberTime.getTime());
    const dayDiff = Math.round(dateDiff / oneDay)
    const active = expiryDays > dayDiff
    console.log(member)
  
    const status = active 
      ? "<span class='active true'> Active </span>"
      : "<span class='active false'> Expired </span>"

    const fullName = `${member.lastName} ${member.firstName}`
    const tr = document.createElement("tr")

    tr.innerHTML = 
      "<td>" + fullName + "</td>" +
      "<td>" + (matchedPlan.planName || "") + "</td>" +
      "<td>" + (member.attendance ?? 0) + "</td>" +
      "<td>" + status + "</td>" +
      "<td>" +
        "<button class='attendance button'>Log</button>" +
        "<button class='edit button members'>Edit</button>" +
        "<button class='delete button members'>Delete</button>" +
      "</td>"

    const editButton = tr.querySelector(".edit.button.members")
    const deleteButton = tr.querySelector(".delete.button.members")
    const attendanceButton = tr.querySelector(".attendance.button")

    attendanceButton.addEventListener("click", () => logAttendance(member))
    editButton.addEventListener("click", () => startEditMember(member))
    deleteButton.addEventListener("click", () => deleteMember(member._id))

    membersTable.appendChild(tr)
  })
}

async function loadMemberships(searchPlans){
  const res = await fetch(membershipAPI)
  const loadedMemberships = await res.json()

  membershipsTable.innerHTML = ""

  const memberships = (searchPlans !== undefined) ? searchPlans : loadedMemberships
  console.log(memberships)

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
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    membership: planSelect.value,
    createdAt: new Date()
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
    showMsg(memberEditingID === null ? `${lastName.value} added` : `${data.lastName} Updated`, true)
    loadMembers()
    resetMemberForm()
  }else {
    showMsg("Name is required", false)
  }

}

async function saveMembership(){
  const data = {
    planName: planName.value.trim(),
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
    showMsg(membershipEditingID === null ? `${planName.value} Added` : `${planName.value} Updated`, true)
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
  planSelect.value = member.membership
  memberTitle.textContent = "Edit Member"
  memberCancelBtn.style.display = "inline"
}

function startEditPlan(plan){
  membershipEditingID = plan._id
  planName.value = plan.planName
  rate.value = plan.rate
  duration.value = plan.duration
  planTitle.textContent = "Edit Membership"
  planCancelBtn.style.display = "inline"
}

async function resetMemberForm(){
  memberEditingID = null
  lastName.value = ""
  firstName.value = ""
  memberTitle.textContent = "Register Member"
  planSelect.length = 0
  const option = document.createElement("option")
  option.text = "---Select a plan---"
  planSelect.add(option)

  const res = await fetch(membershipAPI)
  const memberships = await res.json()

  memberships.forEach(plan => {
    const option = document.createElement("option")
    option.text = plan.planName
    option.value = plan._id
    planSelect.add(option)
  })
}

function resetMembershipForm(){
  membershipEditingID = null
  planName.value = ""
  rate.value = 0
  duration.value = 0
  planTitle.textContent = "Add Membership Plan"
}

async function logAttendance(member){
  const data = {
    attendance: member.attendance+= 1
  }

  const res = await fetch(memberAPI + "/" + member._id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  
  if(res.ok) {
    showMsg(`${member.lastName} checked in`, true)
    loadMembers()
  }
}

function showMsg(text, isGood){
  const p = document.createElement("p")
  p.textContent = text

  msg.style.display = "flex"
  msg.prepend(p)
  if (!(msg.className)){
    const closeButton = document.createElement("button")
    closeButton.className = "close-msg"
    closeButton.addEventListener("click", () => {
      msg.style.display = "none"
      msg.textContent = ""
      msg.className = ""
    })
    closeButton.textContent = "Close"
    msg.appendChild(closeButton)
  }
  msg.className = isGood ? "good" : "err"
}

searchMembers.addEventListener("input", function(e) {
  console.log(e.target.value)
})

const saveMemberButton = document.querySelector("#saveMember")
const saveMembershipButton = document.querySelector("#saveMembership")

const cancelMemberButton = document.querySelector("#cancelMember")
const cancelMembershipButton = document.querySelector("#cancelMembership")

saveMemberButton.addEventListener("click", saveMember)
saveMembershipButton.addEventListener("click", saveMembership)

cancelMemberButton.addEventListener("click", resetMemberForm)
cancelMembershipButton.addEventListener("click", resetMembershipForm)

resetMemberForm()
loadMembers()
loadMemberships()