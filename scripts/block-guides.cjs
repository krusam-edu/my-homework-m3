const v=(cat,label,inputs=[])=>({kind:'value',cat,label,inputs});
const s=(cat,label,inputs=[])=>({kind:'statement',cat,label,inputs});
const cap=(cat,label,bodies,inputs=[])=>({kind:'cap',cat,label,inputs,bodies});
const get=()=>v('variables','get global homeworkList');
const prop=name=>v('get',name);
const txt=t=>v('text','“'+t+'”');
const num=n=>v('math',String(n));
const empty=()=>v('lists','create empty list');
const join=(...args)=>v('text','join',args.map(x=>['',x]));
const set=(name,value)=>s('set','set '+name+' to',[['',value]]);
const alert=t=>s('procedures','call Notifier1.ShowAlert',[['notice',typeof t==='string'?txt(t):t]]);
const store=()=>s('procedures','call TinyDB1.StoreValue',[['tag',txt('homework')],['valueToStore',get()]]);
const refresh=()=>s('procedures','call RefreshList');
const length=()=>v('lists','length of list',[['list',get()]]);
const cmp=(op,a,b,cat='math')=>v(cat,op,[['',a],['',b]]);
const ifelse=(condition,yes,no)=>({kind:'statement',cat:'control',label:'if',inputs:[['',condition]],bodies:[['then',yes],['else',no]]});
const blank=name=>cmp('=',v('text','trim',[['',prop(name+'.Text')]]),txt(''),'logic');
const guides=[
{title:'Blocks 1 — สร้างตัวแปรรายการ',blocks:[cap('variables','initialize global homeworkList to',[],[['',empty()]])],
steps:['เปิดหน้า Blocks → Built-in → Variables แล้วลาก initialize global name to ลงพื้นที่ว่าง','คลิก name พิมพ์ homeworkList (บล็อก get และ set จะอ้างชื่อนี้)','เปิด Lists ลาก create empty list มาเสียบช่อง to ทางขวาให้แนบสนิท ไม่ใช้บล็อกข้อความที่พิมพ์คำว่า list'],
expected:'เมื่อเริ่มแอป ตัวแปร homeworkList เป็นรายการว่าง ไม่ใช่ข้อความว่าง',
error:'ถ้าต่อไม่ได้ ตรวจว่าใช้ create empty list จาก Lists และไม่ได้ใช้ make a list ที่ยังมีช่องว่าง'},
{title:'Blocks 2 — สร้าง RefreshList',blocks:[cap('procedures','to RefreshList', [['do',[set('ListView1.Elements',get()),set('lblCount.Text',join(txt('การบ้านทั้งหมด '),length(),txt(' รายการ')))]]])],
steps:['Procedures → ลาก to procedure do (แบบไม่มี result) คลิกชื่อเปลี่ยนเป็น RefreshList ไม่เพิ่มพารามิเตอร์','เปิด ListView1 ลาก set ListView1.Elements to วางในช่อง do','Variables → ลาก get เลือก global homeworkList เสียบช่อง to ของ Elements','เปิด lblCount ลาก set lblCount.Text to ต่อใต้คำสั่งแรกใน do','Text → ลาก join เสียบช่อง to ของ lblCount.Text คลิกเฟืองแล้วเพิ่ม string ให้มี 3 ช่อง (หรือใช้ปุ่ม + หากเวอร์ชันนั้นมี)','Text → ลากบล็อกข้อความ ใส่ การบ้านทั้งหมด ตามด้วยเว้นวรรค เสียบช่องแรกของ join','Lists → ลาก length of list เสียบช่องที่สอง แล้วเสียบ get global homeworkList ในช่อง list','Text → ลากข้อความ เว้นวรรคแล้วตามด้วย รายการ เสียบช่องสุดท้ายของ join'],
expected:'เมื่อเรียก RefreshList หน้าจอแสดงรายการทั้งหมดและจำนวน เช่น การบ้านทั้งหมด 3 รายการ',
error:'Elements ต้องรับรายการจาก get global homeworkList ส่วน lblCount.Text รับข้อความจาก join; call RefreshList จะปรากฏใน Procedures หลังสร้างชุดนี้'},
{title:'Blocks 3 — บันทึกการบ้านและ TinyDB',blocks:[cap('control','when btnSave.Click', [['do',[ifelse(v('logic','or',[['',blank('txtSubject')],['',v('logic','or',[['',blank('txtHomework')],['',blank('txtDueDate')]])]]),[alert('กรุณากรอกข้อมูลให้ครบ')],[
s('lists','add items to list',[['list',get()],['item',join(prop('txtSubject.Text'),txt(' | '),prop('txtHomework.Text'),txt(' | ส่ง '),prop('txtDueDate.Text'))]]),
store(),refresh(),set('txtSubject.Text',txt('')),set('txtHomework.Text',txt('')),set('txtDueDate.Text',txt('')),set('ListView1.SelectionIndex',num(0)),alert('บันทึกการบ้านเรียบร้อย')
])]]])],
steps:['เปิด btnSave → ลาก when btnSave.Click ลงพื้นที่ว่าง','Control → ลาก if then เสียบใน do คลิกเฟืองลาก else เข้า if แล้วปิดหน้าต่างเฟือง','Logic → ลาก or เสียบเงื่อนไข if แล้วลาก or อีกชิ้นเสียบช่องที่สองของ or แรก เพื่อรวม 3 เงื่อนไข','Logic → ลาก = จำนวน 3 ชิ้น เสียบช่องแรกของ or แรก และสองช่องของ or ที่ซ้อนอยู่','Text → ลาก trim 3 ชิ้น เสียบด้านซ้ายของ = แต่ละชิ้น แล้วเปิด txtSubject, txtHomework, txtDueDate ลากบล็อกอ่าน .Text มาเสียบ trim ตามลำดับ','Text → ลากข้อความว่าง 3 ชิ้น (ไม่ใส่เว้นวรรค) เสียบด้านขวาของ = ทั้งสาม','Notifier1 → ลาก call Notifier1.ShowAlert ใส่ then แล้ว Text → ข้อความ กรุณากรอกข้อมูลให้ครบ เสียบ notice','Lists → ลาก add items to list ใส่ else แล้ว Variables → get global homeworkList เสียบช่อง list','Text → ลาก join เสียบ item เพิ่มช่องด้วยเฟืองให้ครบ 5 ช่อง จากบนลงล่างใส่ txtSubject.Text, ข้อความ “ | ”, txtHomework.Text, ข้อความ “ | ส่ง ”, txtDueDate.Text (อัญประกาศเป็นกรอบบล็อก ไม่ต้องพิมพ์)','TinyDB1 → ลาก call TinyDB1.StoreValue ต่อใต้ add items ภายใน else; Text → ข้อความ homework เสียบ tag และ get global homeworkList เสียบ valueToStore','Procedures → ลาก call RefreshList ต่อใต้ StoreValue ใน else','เปิด TextBox แต่ละตัว → ลาก set txtSubject.Text to, set txtHomework.Text to, set txtDueDate.Text to ต่อเรียงใน else แล้วเสียบข้อความว่างทุกช่อง','ListView1 → ลาก set ListView1.SelectionIndex to ต่อด้านล่าง แล้ว Math → เลข 0 เสียบช่อง to','Notifier1 → ลาก ShowAlert ต่อท้าย else ใส่ข้อความ บันทึกการบ้านเรียบร้อย ใน notice'],
expected:'ช่องใดว่างหรือมีแต่เว้นวรรคจะแจ้งเตือน; ถ้าครบจะเพิ่มหนึ่งรายการ บันทึกลง TinyDB อัปเดตจอ และล้างช่องกรอก',
error:'StoreValue และคำสั่งหลังจากนั้นต้องอยู่ใน else ทั้งหมด มิฉะนั้นข้อมูลว่างอาจถูกบันทึก; join ต้องมี 5 ช่อง'},
{title:'Blocks 4 — โหลดตอนเปิดแอป',blocks:[cap('control','when Screen1.Initialize',[['do',[s('variables','set global homeworkList to',[['',v('procedures','call TinyDB1.GetValue',[['tag',txt('homework')],['valueIfTagNotThere',empty()]])]]),refresh()]]])],
steps:['Screen1 → ลาก when Screen1.Initialize ลงพื้นที่ว่าง','Variables → ลาก set global homeworkList to ใส่ do','TinyDB1 → ลาก call TinyDB1.GetValue (บล็อกคืนค่า มีเดือยด้านซ้าย) เสียบช่อง to ของตัวแปร','Text → ลากข้อความ homework เสียบ tag ให้สะกดและตัวพิมพ์ตรง StoreValue','Lists → ลาก create empty list เสียบ valueIfTagNotThere เพื่อให้ครั้งแรกได้รายการว่าง','Procedures → ลาก call RefreshList ต่อใต้ set global homeworkList to ภายใน do'],
expected:'เปิดแอปแล้วเห็นข้อมูลที่เคยบันทึก หรือเห็นจำนวน 0 หากยังไม่มี tag homework',
error:'ห้ามใช้ข้อความว่างเป็นค่าเริ่มต้น เพราะคำสั่ง Lists ต้องรับรายการ; GetValue เสียบใน to ไม่ใช่วางต่อท้ายเป็นคำสั่ง'},
{title:'Blocks 5 — เลือกการบ้าน',blocks:[cap('control','when ListView1.AfterPicking',[['do',[alert(join(txt('เลือก: '),prop('ListView1.Selection')))]]])],
steps:['ListView1 → ลาก when ListView1.AfterPicking ลงพื้นที่ว่าง','Notifier1 → ลาก call Notifier1.ShowAlert ใส่ช่อง do','Text → ลาก join แบบ 2 ช่อง เสียบ notice','Text → ข้อความ เลือก: ตามด้วยเว้นวรรค เสียบช่องแรก; ListView1 → บล็อกอ่าน ListView1.Selection เสียบช่องที่สอง','ทดลองแตะการบ้านแถวหนึ่งบนโทรศัพท์ แล้วอ่านแจ้งเตือนก่อนกดปุ่มลบ; ตั้ง MultiSelect เป็น false ถ้ามี property นี้'],
expected:'แจ้งเตือนข้อความการบ้านที่แตะ โดย ListView1 เก็บตำแหน่งไว้ใน SelectionIndex อัตโนมัติ',
error:'Selection เป็นข้อความ ส่วน SelectionIndex เป็นตัวเลข; ไม่ต้องสร้างตัวแปรตำแหน่งเพิ่ม'},
{title:'Blocks 6 — ลบรายการที่เลือก',blocks:[cap('control','when btnDelete.Click',[['do',[ifelse(v('logic','and',[['',cmp('>',prop('ListView1.SelectionIndex'),num(0))],['',cmp('≤',prop('ListView1.SelectionIndex'),length())]]),[
s('lists','remove list item',[['list',get()],['index',prop('ListView1.SelectionIndex')]]),store(),refresh(),set('ListView1.SelectionIndex',num(0)),alert('ลบรายการเรียบร้อย')
],[alert('กรุณาเลือกรายการที่ต้องการลบ')])]]])],
steps:['btnDelete → ลาก when btnDelete.Click; Control → if then ใส่ do แล้วใช้เฟืองเพิ่ม else','Logic → ลาก and เสียบเงื่อนไข if','Math → ลากบล็อกเปรียบเทียบ เลือก > เสียบช่องแรกของ and แล้วใส่ ListView1.SelectionIndex ทางซ้ายและเลข 0 ทางขวา','Math → ลากบล็อกเปรียบเทียบอีกชิ้น เลือก ≤ เสียบช่องที่สองของ and; ใส่ ListView1.SelectionIndex ทางซ้าย','Lists → ลาก length of list เสียบด้านขวาของ ≤ แล้ว Variables → get global homeworkList เสียบ list','Lists → ลาก remove list item ใส่ then; get global homeworkList เสียบ list และ ListView1.SelectionIndex เสียบ index','TinyDB1 → ลาก StoreValue ต่อใต้ remove ใน then ใส่ข้อความ homework ใน tag และ get global homeworkList ใน valueToStore','Procedures → ลาก call RefreshList ต่อด้านล่างใน then','ListView1 → ลาก set ListView1.SelectionIndex to ต่อใน then แล้วเสียบ Math → เลข 0 เพื่อยกเลิกการเลือกเดิม','Notifier1 → ลาก ShowAlert ต่อท้าย then ใส่ข้อความ ลบรายการเรียบร้อย','Notifier1 → ลาก ShowAlert อีกชิ้นใส่ else แล้วเสียบข้อความ กรุณาเลือกรายการที่ต้องการลบ'],
expected:'ลบเฉพาะตำแหน่งที่เลือก บันทึกรายการใหม่ และยกเลิกการเลือก; กดลบซ้ำโดยไม่เลือกจะแจ้งเตือน',
error:'index เริ่มที่ 1 ไม่ใช่ 0; ใช้ remove list item ไม่ใช้ TinyDB.ClearAll และต้อง StoreValue หลังลบ'}
];
module.exports=guides;
