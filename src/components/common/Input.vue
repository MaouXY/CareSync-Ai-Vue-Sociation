\u003ctemplate\u003e
  \u003cdiv class="input-wrapper"
    :class="[
      `input-wrapper-${size}`,
      { 'input-wrapper-focus': isFocused },
      { 'input-wrapper-error': error },
      { 'input-wrapper-success': success },
      { 'input-wrapper-disabled': disabled },
      { 'input-wrapper-with-icon': hasIcon },
      { 'input-wrapper-with-prefix': $slots.prefix },
      { 'input-wrapper-with-suffix': $slots.suffix }
    ]"
  \u003e
    \u003c!-- 前缀图标/内容 --\u003e
    \u003cdiv v-if="$slots.prefix || icon" class="input-prefix"
      :class="{ 'input-prefix-disabled': disabled }"
    \u003e
      \u003cdiv v-if="$slots.prefix" class="input-prefix-content"
        @click.stop
      \u003e
        \u003cslot name="prefix"></slot>
      \u003c/div>
      \u003cdiv v-else-if="icon" class="input-icon"
        :class="{ 'input-icon-disabled': disabled }"
      \u003e
        \u003ccomponent :is="icon" :size="iconSize" />
      \u003c/div>
    \u003c/div>
    
    \u003c!-- 输入框 --\u003e
    \u003cinput
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :minlength="minlength"
      :autofocus="autofocus"
      :required="required"
      :class="[
        'input',
        `input-${size}`,
        { 'input-disabled': disabled },
        { 'input-readonly': readonly },
        { 'input-has-prefix': $slots.prefix || icon },
        { 'input-has-suffix': $slots.suffix || clearable && inputValue }
      ]"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @change="handleChange"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @keypress="handleKeypress"
    />
    
    \u003c!-- 清除按钮 --\u003e
    \u003cdiv
      v-if="clearable && inputValue && !disabled && !readonly"
      class="input-clear"
      @click="handleClear"
      aria-label="清除"
    \u003e
      \u003csvg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        \u003cpath d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      \u003c/svg>
    \u003c/div
    
    \u003c!-- 后缀内容 --\u003e
    \u003cdiv v-if="$slots.suffix" class="input-suffix"
      :class="{ 'input-suffix-disabled': disabled }"
    \u003e
      \u003cdiv class="input-suffix-content" @click.stop
      \u003e
        \u003cslot name="suffix"></slot>
      \u003c/div>
    \u003c/div>
  \u003c/div>
  
  \u003c!-- 错误提示 --\u003e
  \u003cdiv v-if="error" class="input-error-message"
    :class="{ 'input-error-message-sm': size === 'small' }"
  \u003e
    {{ error }}
  \u003c/div>
\u003c/template\u003e

\u003cscript lang="ts" setup\u003e
import { ref, computed, watch } from 'vue';

// Props定义
const props = defineProps({
  // 绑定值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  
  // 输入框类型
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => [
      'text', 'password', 'email', 'tel', 'number',
      'search', 'url', 'date', 'time', 'datetime-local'
    ].includes(value)
  },
  
  // 尺寸
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  
  // 占位符
  placeholder: {
    type: String,
    default: ''
  },
  
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  
  // 是否只读
  readonly: {
    type: Boolean,
    default: false
  },
  
  // 最大长度
  maxlength: {
    type: Number,
    default: undefined
  },
  
  // 最小长度
  minlength: {
    type: Number,
    default: undefined
  },
  
  // 是否自动获取焦点
  autofocus: {
    type: Boolean,
    default: false
  },
  
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  
  // 错误提示信息
  error: {
    type: String,
    default: ''
  },
  
  // 是否显示成功状态
  success: {
    type: Boolean,
    default: false
  },
  
  // 是否可清除
  clearable: {
    type: Boolean,
    default: false
  },
  
  // 图标
  icon: {
    type: [Object, Function, String],
    default: null
  },
  
  // 图标尺寸
  iconSize: {
    type: [String, Number],
    default: 16
  }
});

// Emits定义
const emit = defineEmits([
  'update:modelValue',
  'input',
  'change',
  'focus',
  'blur',
  'keydown',
  'keyup',
  'keypress',
  'clear'
]);

// 响应式数据
const inputValue = ref(props.modelValue);
const isFocused = ref(false);

// 计算属性
const hasIcon = computed(() => !!props.icon);

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});

// 处理输入事件
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  emit('update:modelValue', inputValue.value);
  emit('input', event);
};

// 处理变化事件
const handleChange = (event: Event) => {
  emit('change', event);
};

// 处理焦点事件
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

// 处理失焦事件
const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

// 处理键盘按下事件
const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event);
};

// 处理键盘释放事件
const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event);
};

// 处理键盘按下并释放事件
const handleKeypress = (event: KeyboardEvent) => {
  emit('keypress', event);
};

// 处理清除事件
const handleClear = () => {
  inputValue.value = '';
  emit('update:modelValue', '');
  emit('clear');
  // 重新聚焦
  const inputEl = document.querySelector(`.input-wrapper:has([v-model="inputValue"]) input`) as HTMLInputElement;
  if (inputEl) {
    inputEl.focus();
  }
};
\u003c/script\u003e

\u003cstyle scoped\u003e
.input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  border-radius: var(--radius-md);
  border: 2px solid var(--light-hover);
  transition: all var(--transition-normal);
  background-color: white;
}

.input-wrapper:focus-within,
.input-wrapper-focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-wrapper-error {
  border-color: var(--danger);
}

.input-wrapper-error:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-wrapper-success {
  border-color: var(--success);
}

.input-wrapper-success:focus-within {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.input-wrapper-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--light);
}

/* 前缀和后缀 */
.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral);
  pointer-events: none;
}

.input-prefix-disabled,
.input-suffix-disabled {
  color: var(--neutral);
  opacity: 0.6;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-prefix-content,
.input-suffix-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 输入框 */
.input {
  flex: 1;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 1rem;
  color: var(--dark);
  transition: all var(--transition-normal);
}

.input::placeholder {
  color: var(--neutral);
}

.input-disabled {
  background-color: transparent;
  cursor: not-allowed;
}

.input-readonly {
  background-color: var(--light);
  cursor: not-allowed;
}

/* 清除按钮 */
.input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--neutral);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--transition-normal);
  pointer-events: auto;
}

.input-clear:hover {
  background-color: var(--light);
  color: var(--dark);
}

/* 尺寸样式 */
.input-wrapper-small,
.input-wrapper-medium,
.input-wrapper-large {
  height: auto;
}

.input-small {
  font-size: 0.875rem;
}

.input-medium {
  font-size: 1rem;
}

.input-large {
  font-size: 1.125rem;
}

/* 带前缀/后缀的边距调整 */
.input-wrapper-with-prefix .input,
.input-has-prefix {
  padding-left: var(--spacing-md);
}

.input-wrapper-with-suffix .input,
.input-has-suffix {
  padding-right: var(--spacing-md);
}

.input-wrapper-small .input-prefix,
.input-wrapper-small .input-suffix {
  padding: 0.5rem;
}

.input-wrapper-medium .input-prefix,
.input-wrapper-medium .input-suffix {
  padding: 0.75rem;
}

.input-wrapper-large .input-prefix,
.input-wrapper-large .input-suffix {
  padding: 1rem;
}

.input-wrapper-small .input {
  padding: 0.5rem;
}

.input-wrapper-medium .input {
  padding: 0.75rem;
}

.input-wrapper-large .input {
  padding: 1rem;
}

/* 错误提示信息 */
.input-error-message {
  margin-top: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--danger);
  line-height: 1.4;
}

.input-error-message-sm {
  font-size: 0.75rem;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .input {
    font-size: 0.875rem;
  }
  
  .input-wrapper-medium .input {
    padding: 0.625rem;
  }
  
  .input-wrapper-large .input {
    padding: 0.75rem;
  }
}

/* 数字输入框去除上下箭头 */
.input[type="number"]::-webkit-inner-spin-button,
.input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input[type="number"] {
  -moz-appearance: textfield;
}

/* 搜索输入框去除默认样式 */
.input[type="search"]::-webkit-search-decoration,
.input[type="search"]::-webkit-search-cancel-button,
.input[type="search"]::-webkit-search-results-button,
.input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
\u003c/style\u003e