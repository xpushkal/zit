use crossterm::event::{KeyCode, KeyEvent, KeyModifiers};
use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph, Wrap},
    Frame,
};

/// The AI mentor panel mode.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AiMode {
    Menu,
    Input,
    Result,
}

/// State for the AI Mentor panel.
pub struct AiMentorState {
    pub mode: AiMode,
    pub selected: usize,
    pub input: String,
    pub result_text: String,
    pub result_scroll: u16,
    pub last_action: Option<String>,
}

impl Default for AiMentorState {
    fn default() -> Self {
        Self {
            mode: AiMode::Menu,
            selected: 0,
            input: String::new(),
            result_text: String::new(),
            result_scroll: 0,
            last_action: None,
        }
    }
}

const MENU_ITEMS: &[(&str, &str)] = &[
    ("🔍 Explain Repo", "Explain the current repository state"),
    ("💬 Ask a Question", "Ask the AI mentor anything about git"),
    (
        "🛡️ Recommend",
        "Get a safe recommendation for a git operation",
    ),
    ("🏥 Health Check", "Test connectivity to the AI service"),
];

pub fn render(f: &mut Frame, area: Rect, state: &AiMentorState, ai_available: bool, loading: bool) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3), // Title
            Constraint::Min(8),    // Content area
            Constraint::Length(3), // Hints
        ])
        .split(area);

    // Title
    let ai_status = if loading {
        Span::styled(" ⏳ Loading... ", Style::default().fg(Color::Yellow))
    } else if ai_available {
        Span::styled(" ● Connected ", Style::default().fg(Color::Green))
    } else {
        Span::styled(" ○ Not configured ", Style::default().fg(Color::Red))
    };

    let title = Paragraph::new(Line::from(vec![
        Span::styled(
            "🤖 AI Mentor",
            Style::default()
                .fg(Color::Magenta)
                .add_modifier(Modifier::BOLD),
        ),
        Span::raw(" — "),
        ai_status,
    ]))
    .block(
        Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::Magenta)),
    );
    f.render_widget(title, chunks[0]);

    // Content area
    match state.mode {
        AiMode::Menu => render_menu(f, chunks[1], state, ai_available),
        AiMode::Input => render_input(f, chunks[1], state),
        AiMode::Result => render_result(f, chunks[1], state),
    }

    // Hints
    let hints = match state.mode {
        AiMode::Menu => Line::from(vec![
            Span::styled(" ↑/↓ ", Style::default().fg(Color::Cyan)),
            Span::raw("Navigate  "),
            Span::styled("Enter ", Style::default().fg(Color::Cyan)),
            Span::raw("Select  "),
            Span::styled("q ", Style::default().fg(Color::Red)),
            Span::raw("Back"),
        ]),
        AiMode::Input => Line::from(vec![
            Span::styled(" Enter ", Style::default().fg(Color::Cyan)),
            Span::raw("Send  "),
            Span::styled("Esc ", Style::default().fg(Color::Red)),
            Span::raw("Cancel"),
        ]),
        AiMode::Result => Line::from(vec![
            Span::styled(" PgDn/PgUp ", Style::default().fg(Color::Cyan)),
            Span::raw("Scroll  "),
            Span::styled("Esc ", Style::default().fg(Color::Red)),
            Span::raw("Back to menu"),
        ]),
    };
    let hints_widget = Paragraph::new(hints).block(
        Block::default()
            .borders(Borders::TOP)
            .border_style(Style::default().fg(Color::DarkGray)),
    );
    f.render_widget(hints_widget, chunks[2]);
}

fn render_menu(f: &mut Frame, area: Rect, state: &AiMentorState, ai_available: bool) {
    let mut lines = Vec::new();
    lines.push(Line::from(Span::raw("")));

    for (i, (label, desc)) in MENU_ITEMS.iter().enumerate() {
        let is_selected = i == state.selected;
        let arrow = if is_selected { "▶ " } else { "  " };
        let style = if is_selected {
            Style::default()
                .fg(Color::Cyan)
                .add_modifier(Modifier::BOLD)
        } else {
            Style::default().fg(Color::White)
        };

        lines.push(Line::from(vec![
            Span::styled(
                format!("  {} ", arrow),
                Style::default().fg(if is_selected {
                    Color::Cyan
                } else {
                    Color::DarkGray
                }),
            ),
            Span::styled(*label, style),
        ]));
        lines.push(Line::from(Span::styled(
            format!("       {}", desc),
            Style::default().fg(Color::DarkGray),
        )));
        lines.push(Line::from(Span::raw("")));
    }

    if !ai_available {
        lines.push(Line::from(Span::raw("")));
        lines.push(Line::from(Span::styled(
            "  ⚠ AI not configured. Add to ~/.config/zit/config.toml:",
            Style::default().fg(Color::Yellow),
        )));
        lines.push(Line::from(Span::styled(
            "    [ai]",
            Style::default().fg(Color::DarkGray),
        )));
        lines.push(Line::from(Span::styled(
            "    enabled = true",
            Style::default().fg(Color::DarkGray),
        )));
        lines.push(Line::from(Span::styled(
            "    endpoint = \"https://your-api.execute-api.region.amazonaws.com/dev/mentor\"",
            Style::default().fg(Color::DarkGray),
        )));
        lines.push(Line::from(Span::styled(
            "    api_key = \"your-api-key\"",
            Style::default().fg(Color::DarkGray),
        )));
        lines.push(Line::from(Span::raw("")));
        lines.push(Line::from(Span::styled(
            "  Or set env vars: ZIT_AI_ENDPOINT + ZIT_AI_API_KEY",
            Style::default().fg(Color::DarkGray),
        )));
    }

    let menu = Paragraph::new(lines).block(
        Block::default()
            .title(Span::styled(
                " Choose an action ",
                Style::default().fg(Color::White),
            ))
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::DarkGray)),
    );
    f.render_widget(menu, area);
}

fn render_input(f: &mut Frame, area: Rect, state: &AiMentorState) {
    let action_label = state.last_action.as_deref().unwrap_or("Question");

    let lines = vec![
        Line::from(Span::raw("")),
        Line::from(Span::styled(
            format!("  {}: ", action_label),
            Style::default().fg(Color::Cyan),
        )),
        Line::from(Span::raw("")),
        Line::from(Span::styled(
            format!("  > {}_", state.input),
            Style::default()
                .fg(Color::White)
                .add_modifier(Modifier::BOLD),
        )),
    ];

    let input_widget = Paragraph::new(lines).block(
        Block::default()
            .title(Span::styled(
                format!(" {} ", action_label),
                Style::default()
                    .fg(Color::Cyan)
                    .add_modifier(Modifier::BOLD),
            ))
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::Cyan)),
    );
    f.render_widget(input_widget, area);
}

fn render_result(f: &mut Frame, area: Rect, state: &AiMentorState) {
    let title_text = state.last_action.as_deref().unwrap_or("AI Response");

    let lines: Vec<Line> = state
        .result_text
        .lines()
        .map(|l| {
            Line::from(Span::styled(
                format!("  {}", l),
                Style::default().fg(Color::White),
            ))
        })
        .collect();

    let result = Paragraph::new(lines)
        .block(
            Block::default()
                .title(Span::styled(
                    format!(" {} ", title_text),
                    Style::default()
                        .fg(Color::Green)
                        .add_modifier(Modifier::BOLD),
                ))
                .borders(Borders::ALL)
                .border_style(Style::default().fg(Color::Green)),
        )
        .scroll((state.result_scroll, 0))
        .wrap(Wrap { trim: false });
    f.render_widget(result, area);
}

pub fn handle_key(app: &mut crate::app::App, key: KeyEvent) -> anyhow::Result<()> {
    match app.ai_mentor_state.mode {
        AiMode::Menu => handle_menu_key(app, key),
        AiMode::Input => handle_input_key(app, key),
        AiMode::Result => handle_result_key(app, key),
    }
}

fn handle_menu_key(app: &mut crate::app::App, key: KeyEvent) -> anyhow::Result<()> {
    match key.code {
        KeyCode::Up | KeyCode::Char('k') => {
            if app.ai_mentor_state.selected > 0 {
                app.ai_mentor_state.selected -= 1;
            }
        }
        KeyCode::Down | KeyCode::Char('j') => {
            if app.ai_mentor_state.selected + 1 < MENU_ITEMS.len() {
                app.ai_mentor_state.selected += 1;
            }
        }
        KeyCode::Enter => {
            if app.ai_client.is_none() {
                // Launch interactive AI setup wizard
                app.start_ai_setup();
                return Ok(());
            }
            match app.ai_mentor_state.selected {
                0 => {
                    // Explain repo — no input needed, fire directly
                    app.ai_mentor_state.last_action = Some("Explain Repo".to_string());
                    app.start_ai_query("explain_repo".to_string(), None);
                }
                1 => {
                    // Ask a question — needs input
                    app.ai_mentor_state.last_action = Some("Ask AI".to_string());
                    app.ai_mentor_state.mode = AiMode::Input;
                    app.ai_mentor_state.input.clear();
                }
                2 => {
                    // Recommend — needs input
                    app.ai_mentor_state.last_action = Some("Recommend".to_string());
                    app.ai_mentor_state.mode = AiMode::Input;
                    app.ai_mentor_state.input.clear();
                }
                3 => {
                    // Health check — fire directly
                    app.ai_mentor_state.last_action = Some("Health Check".to_string());
                    app.start_ai_query("health_check".to_string(), None);
                }
                _ => {}
            }
        }
        _ => {}
    }
    Ok(())
}

fn handle_input_key(app: &mut crate::app::App, key: KeyEvent) -> anyhow::Result<()> {
    match key.code {
        KeyCode::Esc => {
            app.ai_mentor_state.mode = AiMode::Menu;
        }
        KeyCode::Enter => {
            if app.ai_mentor_state.input.trim().is_empty() {
                return Ok(());
            }
            let query = app.ai_mentor_state.input.clone();
            let action = app.ai_mentor_state.last_action.clone().unwrap_or_default();

            let action_type = if action.contains("Recommend") {
                "recommend"
            } else {
                "explain_repo"
            };

            app.start_ai_query(action_type.to_string(), Some(query));
        }
        KeyCode::Char(c) => {
            if !key.modifiers.contains(KeyModifiers::CONTROL) {
                app.ai_mentor_state.input.push(c);
            }
        }
        KeyCode::Backspace => {
            app.ai_mentor_state.input.pop();
        }
        _ => {}
    }
    Ok(())
}

fn handle_result_key(app: &mut crate::app::App, key: KeyEvent) -> anyhow::Result<()> {
    match key.code {
        KeyCode::Esc | KeyCode::Char('q') => {
            app.ai_mentor_state.mode = AiMode::Menu;
            app.ai_mentor_state.result_scroll = 0;
        }
        KeyCode::PageDown | KeyCode::Char('j') => {
            app.ai_mentor_state.result_scroll = app.ai_mentor_state.result_scroll.saturating_add(3);
        }
        KeyCode::PageUp | KeyCode::Char('k') => {
            app.ai_mentor_state.result_scroll = app.ai_mentor_state.result_scroll.saturating_sub(3);
        }
        KeyCode::Down => {
            app.ai_mentor_state.result_scroll = app.ai_mentor_state.result_scroll.saturating_add(1);
        }
        KeyCode::Up => {
            app.ai_mentor_state.result_scroll = app.ai_mentor_state.result_scroll.saturating_sub(1);
        }
        _ => {}
    }
    Ok(())
}
