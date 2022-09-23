/*
 * @Author: 冯琦昌 2309997549@qq.com
 * @Date: 2022-08-20 14:26:08
 * @LastEditors: 冯琦昌 2309997549@qq.com
 * @LastEditTime: 2022-09-23 16:23:11
 * @FilePath: \page\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
$("#search").click(function () {
    let url = $(".dropdown-menu1 .active").attr("data-url")
    window.open(url + $('#searchValue').val())
})
$('#searchValue').keypress(function (even) {
    if (13 === even.which) {
        $("#search").click()
    }
});
$('.dropdown-menu1 li').click(function () {
    $('#dropdownMenuButton1').text($(this).text())
    $(this).siblings().find('a').removeClass('active')
    $(this).find('a').addClass('active')
})
let okrList = []
let toDoList = []
let notepadList = []
function creatCard() {
    localStorage.getItem("OKRLIST") && JSON.parse(localStorage.getItem("OKRLIST")).length > 0 ? okrList = JSON.parse(localStorage.getItem("OKRLIST")) : addCard();
    okrList.length === 0?.return;
    $(okrList).each(function (i, item) {
        addCard()
        $($('main .okr-card')[i]).find(".input1").val(item.input1)
        $($('main .okr-card')[i]).find(".input2").val(item.input2)
        $($('main .okr-card')[i]).find(".input3").val(item.input3)
        $($('main .okr-card')[i]).find(".input4").val(item.input4)
        $($('main .okr-card')[i]).find(".input5").val(item.input5)
        $($('main .okr-card')[i]).find(".input6").val(item.input6)
    })
}
creatCard()
function creatToDoList() {
    localStorage.getItem("TODOLIST") && JSON.parse(localStorage.getItem("TODOLIST")).length > 0 ? toDoList = JSON.parse(localStorage.getItem("TODOLIST")) : addLine();
    toDoList.length === 0?.return;
    $(toDoList).each(function (i, item) {
        addLine()
        $("#todolist-container .todolist-input").eq(i).val(toDoList[i].content).hide()
        $("#todolist-container .show-todo").eq(i).text(toDoList[i].content).show()
        $("#todolist-container .time").eq(i).text(toDoList[i].time).show()
        $("#todolist-container .saveLine").eq(i).hide()
        $("#todolist-container .editLine").eq(i).show()
    })
}
creatToDoList()
$('.okr-add-card-body').click(function () {
    addCard()
})
function addCard() {
    $('.okr-add-card').before($('#template').html())
    // $($('#template').html()).insertBefore($('.okr-add-card'))
    resetIndex()
}
function resetIndex() {
    $('main .okr-idx').each(function (i) {
        $(this).text('OKR' + (i + 1))
    })
}
//保存数据至本地
function setOkrItem() {
    okrList = []
    $('main .okr-card').each(function () {
        let cardData = {}
        cardData.input1 = $(this).find('.input1').val()
        cardData.input2 = $(this).find('.input2').val()
        cardData.input3 = $(this).find('.input3').val()
        cardData.input4 = $(this).find('.input4').val()
        cardData.input5 = $(this).find('.input5').val()
        cardData.input6 = $(this).find('.input6').val()
        okrList.push(cardData)
    })
    localStorage.setItem("OKRLIST", JSON.stringify(okrList))
}
//召唤确认弹窗
$('#saveOkr').click(function () {
    let res = confirm("确定保存？")
    if (res) {
        setOkrItem()
    }
})

//删除OKR配置
$('#deleteOkr').click(function () {
    $('main .remove-Card').show()
    $('#saveOkr').hide()
    $('#deleteOkr').hide()
    $('#deleteAllOkr').hide()
    $(".okr-add-card").hide()
    $('#back').show()
})
// 删除OKR卡片
$('main').on("click", ".remove-Card .bi-trash", function () {
    $(this).parents('.card').remove()
    setOkrItem()
})
//取消删除OKR操作
$('#back').click(function () {
    $('main .remove-Card').hide()
    $('#saveOkr').show()
    $('#deleteAllOkr').show()
    $('#deleteOkr').show()
    $(".okr-add-card").show()
    $('#back').hide()
    resetIndex()
})
// 删除所有OKR 确认弹窗
$('#deleteAllOkr').click(function () {
    let res = confirm("确定删除所有OKR？")
    if (res) {
        removeOkrItem()
    }
})
function removeOkrItem() {
    $("main .okr-card").remove()
    localStorage.removeItem('OKRLIST')
}
// ----------------------------------------------------------------todolist部分
$("#addLine").click(function () {
    addLine()
})
function resetLineNumber() {
    $("#todolist-container .line-num").each(function (i) {
        $(this).text(i + 1)
    })
}
function addLine() {
    $('#todolist-container').append($('#templateToDoList').html())
    resetLineNumber()
}
// 保存
$('#todolist-container').on("click", ".saveLine", function () {
    $(this).hide().siblings("input").hide().siblings(".time, .editLine, .delLine").show().siblings(".cancel").hide()
    $(this).siblings(".show-todo").text($(this).siblings("input").val()).show()
    let time = getFormatDate()
    $(this).siblings(".time").text(time)
    let index = $("#todolist-container .saveLine").index($(this))
    setToDoListItem(index)
})
// 修改
$('#todolist-container').on("click", ".editLine", function () {
    $(this).hide().siblings("input").show().siblings(".delLine, .show-todo, .time").hide()
    $(this).siblings(".saveLine").show()
    $(this).siblings(".cancel").show()
})
// 取消
$('#todolist-container').on("click", ".cancel", function () {
    $(this).hide().siblings("input").hide().siblings(".time, .editLine, .show-todo, .delLine").show()
    let index = $("#todolist-container .cancel").index($(this))
    $(this).siblings('input').val(toDoList[index].content)
    $(this).siblings(".saveLine").hide()
})
// 删除本行
$('#todolist-container').on("click", ".delLine", function () {
    $(this).parents('.line').remove()
    let index = $("#todolist-container .delLine").index($(this))
    delLineItem(index)
    resetLineNumber()
})
// 日期格式化
function getFormatDate() {
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
// 删除一条、同步至本地存储
function delLineItem(index) {
    toDoList.splice(index, 1)
    localStorage.setItem("TODOLIST", JSON.stringify(toDoList))
}
// 保存至本地存储
function setToDoListItem(index) {
    toDoList[index] = {
        content: $(".todolist-input").eq(index).val(),
        time: $("#todolist-container .time").eq(index).text()
    }
    localStorage.setItem("TODOLIST", JSON.stringify(toDoList))
}
$("#clearToDoList").click(function () {
    $("#todolist-container").empty()
    clearToDoList()
})
function clearToDoList() {
    let res = confirm("确定清空所有TODOLIST？")
    if (res) {
        localStorage.removeItem('TODOLIST')
    }
}
// -------------------------------------------------------------------------记事本
// 记事本添加一条
$('#addNotepad').click(function () {
    $(this).before($('#notepadTemplate').html())
    $('.empty').hide()
    createdNotepadNum()
})
//取消添加
$('.notepad-modal .content').on("click", ".cancelAddNotepad", function () {
    $(this).parents('.notepad-template').remove()
    createdNotepadNum()
    if ($('.notepad-modal .content .notepad-template').length === 0) {
        $('.empty').show()
    }
})
//保存添加
$('.notepad-modal .content').on("click", ".saveAddNotepad", function () {
    $(this).parent().siblings('textarea').hide().siblings('p').text($(this).parent().siblings('textarea').val()).show()
    $(this).hide().siblings('.editNotepad, .delNotepad').show().siblings('.cancelAddNotepad, .disCardNotepad').hide()
    saveNotepad($('.notepad-modal .content .saveAddNotepad').index($(this)))
})
//修改
$('.notepad-modal .content').on("click", ".editNotepad", function () {
    $(this).hide().siblings('.delNotepad').hide().siblings('.saveAddNotepad, .disCardNotepad').show().parent().siblings('textarea').show().siblings('p').hide()
})
//取消修改
$('.notepad-modal .content').on("click", ".disCardNotepad", function () {
    $(this).hide().siblings('.saveAddNotepad, .disCardNotepad').hide().siblings('.editNotepad, .delNotepad').show().parent().siblings('textarea').val($(this).parent().siblings('p').text()).hide().siblings('p').show()
})
//删除
$('.notepad-modal .content').on("click", ".delNotepad", function () {
    delNotepad($('.notepad-modal .content .delNotepad').index($(this)))
    $(this).parents('.notepad-template').remove()
    createdNotepadNum()
})
// 序号
function createdNotepadNum() {
    $('.notepad-modal .content .notepad-num').each(function (i) {
        $(this).text(`${i + 1}、`)
    })
}
// 记事本内容保存本地存储
function saveNotepad(i) {
    notepadList[i] = $('.notepad-modal .content textarea').eq(i).val()
    localStorage.setItem("NOTEPADLIST", JSON.stringify(notepadList))
}
// 记事本内容保存本地存储
function delNotepad(i) {
    notepadList.splice(i, 1)
    localStorage.setItem("NOTEPADLIST", JSON.stringify(notepadList))
}
// 初进页面渲染
function initNotepad() {
    let data = localStorage.getItem("NOTEPADLIST")
    data && JSON.parse(data).length > 0 ? notepadList = JSON.parse(data) : notepadList = []
    if (notepadList.length > 0) {
        $(notepadList).each(function (i,item){
            $('#addNotepad').click()
            $('.notepad-modal .content textarea').eq(i).hide().val(item)
            $('.notepad-modal .content p').eq(i).show().text(item)
            $('.notepad-modal .content .cancelAddNotepad').hide()
            $('.notepad-modal .content .saveAddNotepad').hide()
            $('.notepad-modal .content .editNotepad').show()
            $('.notepad-modal .content .delNotepad').show()
        })
    }
}
initNotepad()
function clearNotepad() {
    $('.notepad-modal .content .notepad-template').remove()
    localStorage.removeItem("NOTEPADLIST")
}
// ----------------------------------------------------------------------------------------------总操作
//清空所有
$("#clear").click(function () {
    let res = confirm("确定删除所有数据？")
    if (res) {
        localStorage.removeItem('OKRLIST')
        localStorage.removeItem('TODOLIST')
        clearNotepad()
    }
    window.location.reload()
})