// ==UserScript==
// @name         DoStuff
// @namespace    http://tampermonkey.net/
// @version      0.45
// @updateURL    https://raw.githubusercontent.com/ChillMeister/Userscripts/master/dostuff.js
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
        var url = window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, "");
        var myUsername = $('a.username')[0].innerHTML;
        
        var addPMToUsernames = function() {
            $('#user .box.pad.center tbody tr > td a, #torrents .torrent_table table ~ div + blockquote > a, #torrents .torrent_table .torrent > td:nth-child(3) > .nobr > a').each(function(){
                var $this = $(this);
                var id = $this.attr('href').replace('user.php?id=','');
                $this.after(' <a href="inbox.php?action=compose&to='+ id + '">[PM]</a> ');
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

            // Add SRRDB search link for Scene torrents
            $('table.torrent_table > tbody > tr > td:nth-child(1) > a').each(function() {
                if(this.innerHTML.endsWith('Scene')) {
                    var $this = $(this);
                    var releaseNode = this.parentNode.parentNode.nextSibling.nextSibling.children[0];
                    var releaseName = releaseNode.childNodes[0].nodeValue.replace(/\s/g,'').replace('»', '');
                    $(releaseNode.children[0]).append($('<a>', {
                        href: 'http://www.srrdb.com/release/details/' + releaseName,
                        text: '(SRRDB) '
                    }));
                    $(releaseNode.children[0]).append($('<a>', {
                        href: 'http://predb.org/search?searchstr=' + releaseName,
                        text: '(PreDB)'
                    }));
                }
            });
        };

        var staffPMBBcodeGenerator = function() {
            // Add a text field to insert a staff note in PMs
            // This way I don't have to !bbcode2 all the time
            var textbox = $('#quickpost');
            if(!textbox) return;
            var container = document.createElement('div');
            var notebox = $('<textarea>', {
                cols: '70',
                rows: '1',
                style: 'vertical-align:middle;'
            }).appendTo(container);
            var addStaffNoteButton = $('<input>', {
                type: 'button',
                value: 'Insert staff note',
                style: 'vertical-align:middle;',
                click: function() {
                    var oldText = textbox.val();
                    var note = notebox.val();
                    if(!note.endsWith('//' + myUsername)) note += ' //' + myUsername;
                    textbox.val(oldText + '[[n]b][[n]color=red][[n]size=5]' + note + '[/size][/color][/b]');
                    notebox.val('');
                }
            }).appendTo(container);
            textbox.after(container);
            notebox.before(document.createElement('br'));
        };

        var torrentBBcodeGenerator = function() {
            // Same thing but for torrents
            var tech_specs_table = $('#table_manual_upload_2 > tbody');
            var textbox = $('#release_desc');
            var row = document.createElement('tr');
            var label = $('<td>', {
                class: 'label',
                text: 'Add Staff Note'
            }).appendTo(row);
            var container = document.createElement('td');
            row.appendChild(container);
            var notebox = $('<textarea>', {
                cols: '60',
                rows: '2',
                style: 'vertical-align:middle;'
            }).appendTo(container);
            var addStaffNoteButton = $('<input>', {
                type: 'button',
                value: 'Insert staff note',
                style: 'vertical-align:middle;',
                click: function() {
                    var oldText = textbox.val();
                    var note = notebox.val();
                    if(!note.endsWith('//' + myUsername)) note += ' //' + myUsername;
                    textbox.val('[b][color=red][size=5]' + note + '[/size][/color][/b]\n\n' + oldText);
                    notebox.val('');
                }
            }).appendTo(container);
            tech_specs_table.append(row);
        };

        var noBannerLinks = function() {
            // I hate copy pasting the links
            var banner = $('div > form > table:nth-child(3) > tbody > tr:nth-child(2) > td.tdleft')[0];
            var fanart = $('div > form > table:nth-child(3) > tbody > tr:nth-child(6) > td.tdleft')[0];
            var poster = $('div > form > table:nth-child(3) > tbody > tr:nth-child(8) > td.tdleft')[0];

            var nobanner = $('<input>', {
                type: 'button',
                value: 'No banner available',
                style: 'vertical-align:top;',
                click: function() {
                    banner.children[0].value = 'https://cdn2.broadcasthe.net/https/i.imgur.com/hIq9qAn.png';
                }
            }).appendTo(banner);
            var nofanart = $('<input>', {
                type: 'button',
                value: 'No fan art available',
                style: 'vertical-align:top;',
                click: function() {
                    fanart.children[0].value = 'https://cdn2.broadcasthe.net/https/i.imgur.com/55K4Dww.png';
                }
            }).appendTo(fanart);
            var noposter = $('<input>', {
                type: 'button',
                value: 'No poster available',
                style: 'vertical-align:top;',
                click: function() {
                    poster.children[0].value = 'https://cdn2.broadcasthe.net/https/i.imgur.com/qHx6IsI.png';
                }
            }).appendTo(poster);
        };

        addPMToUsernames();
        if(url.startsWith('forums.php')) addPMToForums();
        if(url.startsWith('torrents.php?')) modifyTorrentDetailPage();
        if(url.startsWith('staffpm.php?action=viewconv')) staffPMBBcodeGenerator();
        if(url.startsWith('torrents.php?action=edit') || url.startsWith('upload.php')) torrentBBcodeGenerator();
        if(url.startsWith('series.php?action=edit_info')) noBannerLinks();
    });
}(jQuery));
