const { createApp } = Vue;

Prism.manual = true;

createApp({
  data() {
    return {
      token: localStorage.getItem('token'),
      showLogin: false,
      showShareModal: false,
      loginEmail: '',
      loginPassword: '',
      title: '',
      html: '',
      css: '',
      js: '',
      shareUrl: '',
      currentShareId: null,
      isDragging: false,
      startX: null,
      startWidth: null,
      containerWidth: null,
      editorWidth: '50%',
      minWidth: 250,
      maxWidth: null,
      // Tab state
      activeTab: 'html',
      tabs: [
        { id: 'html', label: 'HTML', icon: '📄', language: 'markup' },
        { id: 'css', label: 'CSS', icon: '🎨', language: 'css' },
        { id: 'js', label: 'JavaScript', icon: '⚡', language: 'javascript' }
      ],
      highlightedCode: {
        html: '',
        css: '',
        js: ''
      },
      showEditor: true,
      showPreview: true
    };
  },

  computed: {
    currentCode: {
      get() {
        return this[this.activeTab];
      },
      set(value) {
        this[this.activeTab] = value;
        this.highlightCode(value, this.activeTab);
      }
    },
    
    previewWidth() {
      if (typeof this.editorWidth === 'string' && this.editorWidth.endsWith('%')) {
        return (100 - parseInt(this.editorWidth)) + '%';
      }
      return `calc(100% - ${this.editorWidth}px)`;
    },

    currentLanguage() {
      const tab = this.tabs.find(t => t.id === this.activeTab);
      return tab ? tab.language : 'markup';
    }
  },

  watch: {
    html(newVal) {
      this.updatePreviewDebounced();
    },
    css(newVal) {
      this.updatePreviewDebounced();
    },
    js(newVal) {
      this.updatePreviewDebounced();
    }
  },

  created() {
    this.updatePreviewDebounced = this.debounce(this.updatePreview, 300);    
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    if (shareId) {
      this.loadSharedSnippet(shareId);
    }
  },

  mounted() {
    this.initializeLayout();
    document.addEventListener('keydown', this.handleKeyboardShortcuts);

    // Initialize syntax highlighting
    this.highlightCode(this.html, 'html');
    this.highlightCode(this.css, 'css');
    this.highlightCode(this.js, 'js');

    // ensure iframe isloaded before updating the preview
    const preview = document.getElementById('preview-frame');
    if (preview) {
      preview.onload = () => {
        this.updatePreview();
      }
    }
  },

  methods: {
    toggleEditor() {
      this.showEditor = !this.showEditor;
    },
    togglePreview() {
      this.showPreview = !this.showPreview;
      if (!this.showPreview) { this.editorWidth = '100%';}
      else { this.editorWidth = '50%'; }
    },
    highlightCode(code, tab) {
      const languageMap = {
        html: 'markup',
        css: 'css',
        js: 'javascript'
      };
      
      const language = languageMap[tab];
      if (!language) return;

      try {
        this.highlightedCode[tab] = Prism.highlight(
          code || '',
          Prism.languages[language],
          language
        );
      } catch (error) {
        console.error('Highlighting error:', error);
        this.highlightedCode[tab] = code || '';
      }
    },
    handleKeydown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
  
        const textarea = event.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const spaces = '  ';
  
        const value = this.currentCode;
        const beforeCursor = value.substring(0, start);
        const afterCursor = value.substring(end);
  
        if (event.shiftKey) {
          // TODO: Shift + Tab undo 2 space
        } else {
          // Handle Tab (indent)
          this.currentCode = beforeCursor + spaces + afterCursor;
  
          this.$nextTick(() => {
            textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
          });
        }
      }
    },
    handleInput(event) {
      const value = event.target.value;
      this[this.activeTab] = value;
      this.highlightCode(value, this.activeTab);
    },
    
    debounce(fn, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    handleKeyboardShortcuts(e) {
      // Handle Ctrl/Cmd + number for tab switching
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= this.tabs.length) {
          this.activeTab = this.tabs[num - 1].id;
          e.preventDefault();
        }
      }

      // Handle Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.saveSnippet();
      }
    },

    initializeLayout() {
      const container = document.querySelector('.editor-container');
      this.containerWidth = container.offsetWidth;
      this.maxWidth = this.containerWidth - this.minWidth;
      
      this.updateLayout();
    },

    updateLayout() {
      const editorGroup = document.querySelector('.editor-group');
      const preview = document.querySelector('.preview');
      
      if (editorGroup && preview) {
        editorGroup.style.width = this.editorWidth;
        preview.style.width = this.previewWidth;
      }
    },

    updatePreview() {
      const preview = document.getElementById('preview-frame');
      if (!preview) return;
      
      const doc = preview.contentDocument;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>${this.css}</style>
          </head>
          <body>
            ${this.html}
            <script>${this.js}<\/script>
          </body>
        </html>
      `);
      doc.close();
    },

    switchTab(tabId) {
      this.activeTab = tabId;
      // re-highlight code when switching tabs
      this.$nextTick(() => {
        this.highlightCode(this[tabId], tabId);
        const editor = document.querySelector('.editor-content textarea');
        if (editor) editor.focus();
      });
    },

    async login() {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.loginEmail,
            password: this.loginPassword
          })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        this.token = data.token;
        localStorage.setItem('token', data.token);
        this.showLogin = false;
      } catch (error) {
        alert('Login failed');
      }
    },

    logout() {
      this.token = null;
      localStorage.removeItem('token');
    },

    async saveSnippet() {
      if (!this.token) {
        this.showLogin = true;
        return;
      }

      try {
        const response = await fetch('/api/snippets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            title: this.title || 'Untitled',
            html: this.html,
            css: this.css,
            js: this.js
          })
        });

        if (!response.ok) throw new Error('Failed to save snippet');

        const data = await response.json();
        this.currentShareId = data.shareId;
        this.shareUrl = `${window.location.origin}/?share=${data.shareId}`;
        this.showShareModal = true;
      } catch (error) {
        alert('Failed to save snippet');
      }
    },

    async loadSharedSnippet(shareId) {
      try {
        const response = await fetch(`/api/snippets/share/${shareId}`);
        if (!response.ok) throw new Error('Failed to load snippet');

        const data = await response.json();
        this.title = data.title;
        this.html = data.html;
        this.css = data.css;
        this.js = data.js;

        this.highlightCode(this.html, 'html');
        this.highlightCode(this.css, 'css');
        this.highlightCode(this.js, 'js');

        this.updatePreview();
      } catch (error) {
        alert('Failed to load shared snippet');
      }
    },

    async copyShareUrl() {
      try {
        await navigator.clipboard.writeText(this.shareUrl);
      } catch (error) {
        alert('Failed to copy URL');
      }
    }
  }
}).mount('#app');