/**
 * @description: editor使用到的代码
 * @author: zhangyang
 * @datetime: 2014-11-25 20:38
 **/
(function() {
	'use strict';

	var defaults = {
		previewCtn: '#editor-preview',
		editor: '#editor-editor',
		editorBlock: '#editor-editblock',
		autoSaveTips: '#editor-autosave-tips',
		afterSubmit: function() {}
	};

	var Editor = function(options) {
		this.options = $.extend(defaults, options);
		this.init();
		var autoSaveTips = $(this.options.autoSaveTips);
		this.autoSavingTip = autoSaveTips.children(':first-child');
		this.autoSavingSuccessTip = this.autoSavingTip.next();
		this.autoSavingTip.hide();
		this.autoSavingSuccessTip.hide();
	};

	Editor.fn = Editor.prototype;

	Editor.fn.init = function() {
		var _ = this;

		// 设置marked
		marked.setOptions({
			highlight: function(code) {
				return hljs.highlightAuto(code).value;
			}
		});

		// 隐藏元素
		this.edit();

		// 加载历史纪录
		this.loadSaved();

		// 绑定自动保存
		$(this.options.editor).on('keyup', function(){
			clearTimeout(_.autoSaveFunc);
			_.autoSaveFunc = setTimeout(function(){
				_.autoSave();
				console.log('auto saved');
			}, 3000);
		});
	};

	Editor.fn.submit = function() {

	};

	Editor.fn.edit = function() {
		$(this.options.previewCtn).hide();
		$(this.options.editorBlock).show();
	};

	Editor.fn.preview = function() {
		$(this.options.editorBlock).hide();
		$(this.options.previewCtn).show().html(marked($(this.options.editor).val()));
	};

	Editor.fn.autoSave = function() {
		var _ = this;

		if (localStorage) {
			clearTimeout(_._tip1Func);
			clearTimeout(_._tip2Func);
			localStorage.setItem('mbautosave', $(_.options.editor).val());
			_.autoSavingTip.show(function() {
				_._tip1Func = setTimeout(function() {
					_.autoSavingSuccessTip.show();
					_.autoSavingTip.hide();
					_._tip2Func = setTimeout(function() {
						_.autoSavingSuccessTip.hide();
					}, 500);
				}, 1000);
			});
		}
	};

	Editor.fn.loadSaved = function() {
		if (localStorage) {
			$(this.options.editor).val(localStorage.getItem('mbautosave'));
		}
	};

	var editor = new Editor();

	$('#J_modeSwitcher').find('label').on('click', function() {
		var _ = $(this);
		var text = $.trim(_.text());
		if (text === 'Write') {
			editor.edit();
		} else if (text === 'Preview') {
			editor.preview();
		}
	});

}());