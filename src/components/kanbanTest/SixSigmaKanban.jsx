import React, { useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Form, InputGroup } from "react-bootstrap";
import './SixSigmaKanban.css';

// ——— 配置：六標準差兩種方法 ——
const PHASES = {
  DMADV: ["Define", "Measure", "Analyze", "Design", "Verify", "Review"],
  DMAIC: ["Define", "Measure", "Analyze", "Improve", "Control", "Review"],
};

// 優先順序（顯示與值）
const PRIORITY_OPTIONS = [
  { value: 'HIGHEST', label: 'Highest', icon: '⟰' },
  { value: 'HIGH', label: 'High', icon: '⟪' },
  { value: 'MEDIUM', label: 'Medium', icon: '≡' },
  { value: 'LOW', label: 'Low', icon: '⟫' },
  { value: 'LOWEST', label: 'Lowest', icon: '⟱' },
];

// ——— 假資料（之後以 axios 串接後端取代） ——
const seedIssues = [
  { id: "KAN-1", title: "任務 1", owner: "CC", due: "2025-08-15", status: "INIT", method: 'DMAIC', priority: 'MEDIUM' },
  { id: "KAN-2", title: "任務 2", owner: "CC", due: "2025-08-22", status: "Define", method: 'DMAIC', priority: 'HIGH' },
  { id: "KAN-3", title: "任務 3", owner: "Alex", due: "2025-08-20", status: "Measure", method: 'DMAIC', priority: 'LOW' },
  { id: "KAN-4", title: "分析", owner: "CC", due: "2025-08-05", status: "INIT", method: 'DMADV', priority: 'HIGHEST' },
];

function useColumns(method) {
  return useMemo(() => ["INIT", ...(PHASES[method] || []), "DONE"], [method]);
}

// —— 元件：IssueCard（點擊開啟詳細） ——
function IssueCard({ issue, onOpen }) {
  const badgeClass = issue.status === "INIT" ? "badge-init" : issue.status === "DONE" ? "badge-done" : "badge-phase";
  const pri = PRIORITY_OPTIONS.find(p => p.value === issue.priority)?.label || 'Medium';
  return (
    <Card className="issue-card overflow-hidden cursor-pointer" onClick={() => onOpen(issue)}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="fw-bold" style={{ color: "#172B4D" }}>{issue.title}</div>
            <div className="small text-secondary mt-1">
              <Badge pill className={`me-2 ${badgeClass}`}>{issue.id}</Badge>
              <span className="me-3">👤 {issue.owner}</span>
              <span className="me-3">📅 {issue.due}</span>
              <span title="Priority">🏷️ {pri}</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

// —— 元件：留言編輯器（根留言／回覆共用） ——
function CommentEditor({ autoFocus, placeholder = "寫下留言...（Ctrl+Enter 送出）", onSubmit, me }) {
  const editableRef = useRef(null);
  const [html, setHtml] = useState("");
  const [files, setFiles] = useState([]);

  // 以原生 contentEditable + execCommand 實作（相容 React 18 + Vite）
  const exec = (cmd, value = null) => {
    editableRef.current && editableRef.current.focus();
    document.execCommand(cmd, false, value);
    // 立刻同步最新內容
    setHtml(editableRef.current?.innerHTML || "");
  };

  const trySubmit = () => {
    const clean = (html || "").replace(/<p><br><\/p>/g, "").trim();
    if (!clean && files.length === 0) return;
    onSubmit({ html: clean, files });
    setHtml("");
    if (editableRef.current) editableRef.current.innerHTML = "";
    setFiles([]);
  };

  // 允許 Ctrl/Cmd + Enter 送出
  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      trySubmit();
    }
  };

  return (
    <div className="border rounded-3 p-2 bg-white">
      {/* 內嵌一小段樣式：顯示 placeholder */}
      <style>{`.rte[contenteditable="true"]:empty:before{content: attr(data-placeholder); color:#6c757d;}`}</style>
      <div className="d-flex align-items-start gap-2">
        {/* Avatar 佔位，模擬 Jira/React-Comments-Section 的風格 */}
        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{width:32,height:32,fontSize:12}}>{(me||'ME').slice(0,2).toUpperCase()}</div>
        <div className="flex-grow-1">
          {/* Toolbar（原生指令）：粗體、斜體、底線、刪除線、清單、引用、程式碼區塊、連結、標題 */}
          <div className="d-flex flex-wrap align-items-center gap-1 mb-2">
            <Button size="sm" variant="light" onClick={() => exec('bold')}>B</Button>
            <Button size="sm" variant="light" onClick={() => exec('italic')}><span style={{fontStyle:'italic'}}>I</span></Button>
            <Button size="sm" variant="light" onClick={() => exec('underline')}><u>U</u></Button>
            <Button size="sm" variant="light" onClick={() => exec('strikeThrough')}><s>S</s></Button>
            <span className="vr mx-1" />
            <Button size="sm" variant="light" onClick={() => exec('insertUnorderedList')}>• List</Button>
            <Button size="sm" variant="light" onClick={() => exec('insertOrderedList')}>1. List</Button>
            <Button size="sm" variant="light" onClick={() => exec('formatBlock','blockquote')}>❝ 引用</Button>
            <Button size="sm" variant="light" onClick={() => exec('formatBlock','pre')}>{"</> Code"}</Button>
            <span className="vr mx-1" />
            <Button size="sm" variant="light" onClick={() => { const url = prompt('輸入連結 URL'); if (url) exec('createLink', url); }}>🔗 連結</Button>
            <Button size="sm" variant="light" onClick={() => exec('formatBlock','h2')}>H2</Button>
            <Button size="sm" variant="light" onClick={() => exec('formatBlock','h3')}>H3</Button>
            <Button size="sm" variant="light" onClick={() => exec('removeFormat')}>清除</Button>
          </div>

          {/* 可編輯區 */}
          <div
            ref={editableRef}
            className="rte form-control"
            contentEditable
            data-placeholder={placeholder}
            onInput={(e) => setHtml(e.currentTarget.innerHTML)}
            onKeyDown={onKeyDown}
            style={{ minHeight: 80 }}
            suppressContentEditableWarning
            autoFocus={autoFocus}
          />

          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="d-flex align-items-center gap-2">
              <Form.Label className="mb-0">
                <span className="btn btn-light btn-sm">📎 附件</span>
                <Form.Control type="file" multiple className="d-none" onChange={(e) => setFiles(Array.from(e.target.files||[]))} />
              </Form.Label>
              {files.length > 0 && (
                <div className="small text-secondary">{files.length} 個檔案已選取</div>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small me-1">Ctrl/Cmd + Enter</span>
              <Button onClick={trySubmit} variant="primary">送出</Button>
            </div>
          </div>

          {files.length > 0 && (
            <ul className="list-unstyled small text-secondary mt-2 mb-0">
              {files.map((f, i) => (
                <li key={i} className="text-truncate">📎 {f.name}（{Math.ceil((f.size||0)/1024)} KB）</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// —— 元件：單一留言（含回覆） ——
function CommentCard({ c, onReply, me }) {
  const [showReply, setShowReply] = useState(false);
  return (
    <Card className="border-0 border-start border-4 border-primary-subtle">
      <Card.Body className="py-2">
        <div className="small text-secondary d-flex justify-content-between align-items-center">
          <div>👤 {c.author}</div>
          <div>{new Date(c.ts).toLocaleString()}</div>
        </div>
        <div className="mt-1 mb-2" dangerouslySetInnerHTML={{__html: c.html || ''}} />
        {c.attachments?.length > 0 && (
          <ul className="list-unstyled small text-secondary mb-2">
            {c.attachments.map((f, idx) => (
              <li key={idx}>📎 {f.name}（{Math.ceil((f.size||0)/1024)} KB）</li>
            ))}
          </ul>
        )}
        <div className="d-flex gap-2">
          <Button variant="link" size="sm" className="p-0" onClick={() => setShowReply((v) => !v)}>回覆</Button>
        </div>
        {showReply && (
          <div className="mt-2">
            <CommentEditor me={me} autoFocus placeholder="撰寫回覆...（Ctrl+Enter 送出）" onSubmit={(payload) => {
              onReply(c.id, payload);
              setShowReply(false);
            }} />
          </div>
        )}
        {c.replies && c.replies.length > 0 && (
          <div className="mt-2 vstack gap-2 ms-3">
            {c.replies.map((rc) => (
              <CommentCard key={rc.id} c={rc} onReply={onReply} />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

// —— 元件：留言清單（遞迴） ——
function CommentList({ list, onReply, me }) {
  if (!list || list.length === 0) return <div className="text-secondary small">— 尚無留言 —</div>;
  return (
    <div className="vstack gap-2">
      {list.map((c) => (
        <CommentCard key={c.id} c={c} onReply={onReply} me={me} />
      ))}
    </div>
  );
}

export default function SixSigmaKanban() {
  const [method, setMethod] = useState("DMAIC");
  const columns = useColumns(method);

  const [issues, setIssues] = useState(seedIssues);
  const [me] = useState("CC");

  const [keyword, setKeyword] = useState("");
  const [owner, setOwner] = useState("");

  // ===== 詳細視窗（留言板 / 附件 / Promote / 優先順序 / Reply） =====
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(null); // 當前選取的 issue

  // comments: { issueId: [ { id, author, ts, text, attachments, replies: [...] } ] }
  const [comments, setComments] = useState({});
  const [attachments, setAttachments] = useState({}); // issue level attachments

  const openDetails = (issue) => { setActive(issue); setShow(true); };
  const closeDetails = () => setShow(false);

  // Promote 僅在 Modal
  const canPromoteInModal = active && active.owner === me && active.status !== "DONE";
  const promoteInModal = () => {
    if (!active) return;
    const curIdx = columns.indexOf(active.status);
    const next = columns[Math.min(curIdx + 1, columns.length - 1)];
    setIssues((prev) => prev.map((it) => (it.id === active.id ? { ...it, status: next } : it)));
    setActive((prev) => ({ ...prev, status: next }));
  };

  // 更新優先順序
  const changePriority = (issueId, newPri) => {
    setIssues(prev => prev.map(it => it.id === issueId ? { ...it, priority: newPri } : it));
    setActive(prev => ({ ...prev, priority: newPri }));
  };

  // 新增根留言（最新在最上）
  const addRootComment = (issueId, payload) => {
    const entry = {
      id: cryptoRandomId(),
      author: me,
      ts: new Date().toISOString(),
      html: payload.html,
      attachments: payload.files?.map((f) => ({ name: f.name, size: f.size })) || [],
      replies: [],
    };
    setComments((prev) => ({ ...prev, [issueId]: [entry, ...(prev[issueId] || [])] }));
  };

  // 針對某留言新增回覆（最新在最上）
  const addReply = (issueId, parentId, payload) => {
    const reply = {
      id: cryptoRandomId(),
      author: me,
      ts: new Date().toISOString(),
      html: payload.html,
      attachments: payload.files?.map((f) => ({ name: f.name, size: f.size })) || [],
      replies: [],
    };
    setComments((prev) => ({ ...prev, [issueId]: addReplyRecursive(prev[issueId] || [], parentId, reply) }));
  };

  function addReplyRecursive(list, parentId, reply) {
    return (list || []).map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [reply, ...(c.replies || [])] };
      }
      if (c.replies && c.replies.length) {
        return { ...c, replies: addReplyRecursive(c.replies, parentId, reply) };
      }
      return c;
    });
  }

  // Issue 附件（非留言附件）
  const addAttachment = (issueId, fileList) => {
    const items = Array.from(fileList).map((f) => ({ name: f.name, size: f.size }));
    setAttachments((prev) => ({ ...prev, [issueId]: [...items, ...(prev[issueId] || [])] }));
  };

  function cryptoRandomId() {
    try { return crypto.getRandomValues(new Uint32Array(1))[0].toString(16); }
    catch { return Math.random().toString(16).slice(2); }
  }

  // 只顯示當前分頁(method)的 Issue
  const issuesByCol = useMemo(() => {
    const list = issues
      .filter((i) => i.method === method)
      .filter((i) => (keyword ? i.title.toLowerCase().includes(keyword.toLowerCase()) || i.id.includes(keyword) : true))
      .filter((i) => (owner ? i.owner === owner : true));
    const map = Object.fromEntries(columns.map((c) => [c, []]));
    list.forEach((i) => (map[i.status] ? map[i.status].push(i) : (map[i.status] = [i])));
    return map;
  }, [issues, columns, keyword, owner, method]);

  const owners = useMemo(() => Array.from(new Set(issues.filter(i=>i.method===method).map((i) => i.owner))), [issues, method]);

  return (
    <Container fluid className="p-3" style={{ background: "#F7F8F9", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Badge bg="primary" className="rounded-pill">My Kanban Project</Badge>
          <span className="fs-5 fw-bold">六標準差看板</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button variant="outline-secondary" size="sm">分享</Button>
          <Button variant="primary" size="sm">新增任務</Button>
        </div>
      </div>

      {/* Tabs: DMADV / DMAIC */}
      <Tabs id="method-tabs" activeKey={method} onSelect={(k) => setMethod(k || "DMAIC")} className="mb-3" justify>
        <Tab eventKey="DMADV" title={<span className="fw-semibold">DMADV</span>} />
        <Tab eventKey="DMAIC" title={<span className="fw-semibold">DMAIC</span>} />
      </Tabs>

      {/* Filters */}
      <Row className="g-2 mb-3">
        <Col md={6} lg={4}>
          <InputGroup>
            <InputGroup.Text>搜尋</InputGroup.Text>
            <Form.Control placeholder="輸入關鍵字或 KAN- 編號" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </InputGroup>
        </Col>
        <Col md={6} lg={3}>
          <InputGroup>
            <InputGroup.Text>Owner</InputGroup.Text>
            <Form.Select value={owner} onChange={(e) => setOwner(e.target.value)}>
              <option value="">全部</option>
              {owners.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col className="d-flex align-items-center"><span className="text-secondary small">登入：{me}（{method}）</span></Col>
      </Row>

      {/* Kanban: 一排 + 橫向捲動 */}
      <Row className="g-3 d-flex flex-nowrap overflow-auto pb-2">
        {columns.map((col) => (
          <Col key={col} xs="auto" style={{ minWidth: '280px' }}>
            <div className="kanban-column">
              <div className="kanban-column-header">
                <span>{col}</span>
                <Badge bg="light" text="dark">{issuesByCol[col]?.length || 0}</Badge>
              </div>
              {(issuesByCol[col] || []).map((it) => (
                <IssueCard key={it.id} issue={it} onOpen={openDetails} />
              ))}
              {(!issuesByCol[col] || issuesByCol[col].length === 0) && (
                <div className="text-center text-secondary py-4 small">— 無資料 —</div>
              )}
            </div>
          </Col>
        ))}
      </Row>

      {/* 詳細視窗（含留言回覆介面） */}
      {active && (
        <div>
          <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2 mb-0">
                    <Badge bg="secondary">{active.id}</Badge>
                    <span className="fw-semibold">{active.title}</span>
                    <Badge bg="light" text="dark">{active.status}</Badge>
                  </h5>
                  <div className="d-flex align-items-center gap-2">
                    <Button size="sm" variant="primary" onClick={promoteInModal} disabled={!canPromoteInModal}>Promote →</Button>
                    <Button size="sm" variant="outline-secondary" onClick={closeDetails}>關閉</Button>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* 左側：詳細資訊與附件 */}
                    <div className="col-md-5">
                      <div className="p-3 border rounded-3 bg-light">
                        <div className="mb-3">
                          <div className="text-secondary small">受託人</div>
                          <div className="fw-semibold">{active.owner || '未指派'}</div>
                        </div>
                        <div className="mb-3">
                          <div className="text-secondary small">截止日期</div>
                          <div className="fw-semibold">{active.due || '-'}</div>
                        </div>
                        <div className="mb-3">
                          <div className="text-secondary small">方法</div>
                          <div className="fw-semibold">{active.method}</div>
                        </div>
                        {/* 優先順序 */}
                        <div className="mb-3">
                          <div className="text-secondary small">優先順序</div>
                          <Form.Select value={active.priority} onChange={(e) => changePriority(active.id, e.target.value)}>
                            {PRIORITY_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                            ))}
                          </Form.Select>
                        </div>
                        <div className="mb-3">
                          <div className="text-secondary small">描述</div>
                          <div className="text-body">{active.description || '（尚無描述）'}</div>
                        </div>
                        {/* 附件上傳（Issue 級） */}
                        <div className="mb-2">
                          <div className="text-secondary small mb-1">附件</div>
                          <Form.Group controlId="fileUpload">
                            <Form.Control type="file" multiple onChange={(e) => addAttachment(active.id, e.target.files)} />
                          </Form.Group>
                          <ul className="list-unstyled mt-2 mb-0">
                            {(attachments[active.id] || []).map((f, idx) => (
                              <li key={idx} className="small text-secondary d-flex justify-content-between">
                                <span className="text-truncate me-2">📎 {f.name}</span>
                                <span>{Math.ceil((f.size || 0) / 1024)} KB</span>
                              </li>
                            ))}
                            {(!attachments[active.id] || attachments[active.id].length === 0) && (
                              <li className="small text-secondary">— 尚無附件 —</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 右側：留言板（支援回覆，最新在前） */}
                    <div className="col-md-7">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="mb-0">留言板</h6>
                        <span className="text-secondary small">最新留言在最前．支援回覆</span>
                      </div>

                      {/* 新增根留言 */}
                      <CommentEditor me={me} onSubmit={(payload) => addRootComment(active.id, payload)} />

                      <div className="mt-2">
                        <CommentList list={comments[active.id]} onReply={(parentId, payload) => addReply(active.id, parentId, payload)} me={me} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {show && <div className="modal-backdrop fade show" onClick={closeDetails} />}
        </div>
      )}
    </Container>
  );
}
