const puppeteer  = require("puppeteer");
cosnt email = "@gmail.com";
const pass = "";


const message_to_be_sent = "https://www.youtube.com/watch?v=2K385IviSJk";
// Global var to open pages
let cTab;

(async function fn(){
    try{
        let browserOpenPromise = puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args : ["--start-maximized", "--disable-notifications"]
        })
        let browser = await browserOpenPromise;

        let allTabs = await browser.pages();
        cTab = allTabs[0];


        await cTab.goto("https://www.facebook.com/", {waitUntil: 'load', timeout: 0});        

        await cTab.type(".inputtext._55r1._6luy", email, {delay:100});          // Enter email
        await cTab.type(".inputtext._55r1._6luy._9npi", pass,{delay:100} );     // Enter pass
        await cTab.click("._42ft._4jy0._6lth._4jy6._4jy1.selected._51sy", {visible:true});  // Click on login

        await cTab.waitForSelector(".a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7", {visible:true});  // Wait for the profile selector
        await cTab.click(".a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7", {visible:true});             // Click on profile
        
        // Wait for friends selector
        await cTab.waitForSelector(".oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.pq6dq46d.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.l9j0dhe7.abiwlrkh.p8dawk7l.dwo3fsh8.ow4ym5g4.auili1gw.mf7ej076.gmql0nx0.tkr6xdv7.bzsjyuwj.cb02d2ww.j1lvzwm4");
        
        // Goto to friends section
        await cTab.evaluate(GoToFriends,`.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.pq6dq46d.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.l9j0dhe7.abiwlrkh.p8dawk7l.dwo3fsh8.ow4ym5g4.auili1gw.mf7ej076.gmql0nx0.tkr6xdv7.bzsjyuwj.cb02d2ww.j1lvzwm4`);
        

        // Count of Total friends
        await cTab.waitForSelector(".d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.e9vueds3.j5wam9gi.knj5qynh.q66pz984");
        let total_freinds = await cTab.evaluate(total_freinds_counter, ".d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.e9vueds3.j5wam9gi.knj5qynh.q66pz984");
        // Each friends link
        
        await cTab.waitForSelector(".oajrlxb2.gs1a9yip.g5ia77u1.mtkw9kbi.tlpljxtp.qensuy8j.ppp5ayq2.goun2846.ccm00jje.s44p3ltw.mk2mc5f4.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.nhd2j8a9.q9uorilb.mg4g778l.btwxx1t3.pfnyh3mw.p7hjln8o.kvgmc6g5.wkznzc2l.oygrvhab.hcukyx3x.tgvbjcpo.hpfvmrgz.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.l9j0dhe7.i1ao9s8h.esuyzwwr.f1sip0of.du4w35lb.lzcic4wl.abiwlrkh.p8dawk7l.pioscnbf.etr7akla");
        // Scroll till last
        
        let links_arr = [];         // Arr to store links of friends 
        let found = 0;
        while (true){
            // Array of all friends
            let curr_arr = await cTab.evaluate(friends_link_giver,found, ".oajrlxb2.gs1a9yip.g5ia77u1.mtkw9kbi.tlpljxtp.qensuy8j.ppp5ayq2.goun2846.ccm00jje.s44p3ltw.mk2mc5f4.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.nhd2j8a9.q9uorilb.mg4g778l.btwxx1t3.pfnyh3mw.p7hjln8o.kvgmc6g5.wkznzc2l.oygrvhab.hcukyx3x.tgvbjcpo.hpfvmrgz.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.l9j0dhe7.i1ao9s8h.esuyzwwr.f1sip0of.du4w35lb.lzcic4wl.abiwlrkh.p8dawk7l.pioscnbf.etr7akla");
            
            links_arr.push(...curr_arr);
            found = links_arr.length-1;
        
            if (links_arr.length >= total_freinds){
                break;
            }
            else{
                await scrollToBottom();
            }
        }
        
        // Send message to all friends
        await messageSender(links_arr, total_freinds);
        console.log("Message sent to all friends");
    }
    catch(err){
        console.log(err);
    }    
})();



function GoToFriends(f_selector){
    try{
        let all_section = document.querySelectorAll(f_selector);
        // Click on friends section
        let friends_section = all_section[2];
        friends_section.click();
    }
    catch(err){
        console.log(err);
    }
}
function total_freinds_counter(t_f_c_selctor){
    // Return total number of friends using selector
    let total_f_p = document.querySelector(t_f_c_selctor).innerText;
    return Number(total_f_p)-4;
}
function friends_link_giver(found, g_selector){
    try{
        let allFlink = document.querySelectorAll(g_selector);
        
        let links_arr = [];
        for(let i = found; i<allFlink.length; i++){
            // Find link of each friend
            links_arr.push(allFlink[i].getAttribute("href"));
        }
        return links_arr;
    }
    catch(err){
        console.log(err);
    }
}
async function scrollToBottom() {
    await cTab.evaluate(goToBottom);
    function goToBottom() {
        window.scrollBy(0, window.innerHeight);
    }
}
async function messageSender(allFriedns_link_arr, nOfFriends){
        for(let i = 0; i<nOfFriends; i++){
            // Go at current friend link
            
            await cTab.goto(allFriedns_link_arr[i]);

            // Click on message section for opening chat 
            try{

                await cTab.waitForSelector('div[aria-label="Message"]');
            }
            catch(err){
                // console.log(err);
                continue;
            }
            await cTab.click('div[aria-label="Message"]');
            
            // Type message
            await cTab.waitForSelector(".rq0escxv.datstx6m.k4urcfbm.a8c37x1j");
            await cTab.type(".rq0escxv.datstx6m.k4urcfbm.a8c37x1j", message_to_be_sent, {delay:10});
            
            // Press Enter for type message
            await cTab.keyboard.press("Enter");
    
            // Close chat
            await cTab.waitForSelector('div[aria-label="Close chat"]');
            await cTab.click('div[aria-label="Close chat"]');
    }
}
