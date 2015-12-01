// ==UserScript==
// @name         AddPmButtonToUsernameAndDoStuff
// @namespace    http://tampermonkey.net/
// @version      0.38
// @updateURL    https://raw.githubusercontent.com/ChillMeister/Userscripts/master/addpm.js
// @description  does stuff
// @author       Chanterelle
// @match        https://broadcasthe.net/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

/*jQuery = $ because old jQuery*/
 
(function($) {
    $(document).ready(function(){
        var addPMToUsernames = function() {
            // Search
            $('#user .box.pad.center tbody tr > td a').each(function(){
                var id = $(this).attr('href').replace('user.php?id=','');
                $(this).after('<a href="inbox.php?action=compose&to='+ id + '">[PM]</a> ');
            });

            // Forums
            $('#forums .thin table tr.colhead_dark').each(function(){
                var id = $("td strong a", this).attr('href').replace('user.php?id=','');
                $("td > span + span", this).prepend('<a href="inbox.php?action=compose&to='+ id + '">[PM]</a>&nbsp;');
            });

            // Torrent detail page
            $('tr.pad > td > blockquote:nth-child(6) > a').each(function() {
                var id = $(this).attr('href').replace('user.php?id=','');
                $(this).after('&nbsp;<a href="inbox.php?action=compose&to='+ id + '">[PM]</a> ');
            });

            // Torrents page
            $('#torrent_table > tbody > tr.torrent').each(function() {
                var link = $('td:nth-child(3) > div.nobr > a', this);
                // Some torrents are uploaded by AutoUp or are anonymous and have no link
                if(link && link.attr('href')) {
                    var id = link.attr('href').replace('user.php?id=', '');
                    link.after('&nbsp;<a href="inbox.php?action=compose&to='+ id + '">[PM]</a> ');
                }
            });
        };

        var modifyTorrentDetailPage = function() {
            $('tr.pad > td > div.linkbox').each(function() {
                // Hide obnoxious file list
                var $this = $(this);
                var filelist = $this.next().next();
                $('<a>',{
                    text: '[File List]',
                    href: '#',
                    click: function(){
                        filelist.toggle();
                        return false;
                    }
                }).prependTo($this);
                filelist.hide();
                
                // Count number of files in torrents
                var filenum = filelist.find('tbody').children().length - 1;
                var output = ' (' + filenum + ' file';
                if(filenum > 1) output += 's';
                output += ')';
                $this.parent().parent().prev().prev().children()[1].innerHTML += output;
            });
        };

        addPMToUsernames();
        modifyTorrentDetailPage();
    });
}(jQuery));
