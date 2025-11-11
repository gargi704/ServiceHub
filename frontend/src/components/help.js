import React, { useState } from 'react';
import { Typography, Button, TextField, Box, Link as MuiLink, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api.js';
import { toast } from 'react-toastify';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

function Help() {
    const { t } = useTranslation();
    const [queryEmail, setQueryEmail] = useState('');
    const [queryMsg, setQueryMsg] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!queryEmail || !queryMsg) return;
        setSending(true);
        try {
            await axios.post(`${API_BASE_URL}/api/help-query`, {
                email: queryEmail,
                message: queryMsg
            });
            setSent(true);
            setQueryEmail('');
            setQueryMsg('');
        } catch (e) {
            toast.error(t('failedToSend'));
        }
        setSending(false);
    };
    return (
        <>
            <Navbar />
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(120deg, #667eea 10%, #764ba2 80%)',
                py: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}>
                {/* Hero Glass Box */}
                <Paper elevation={8} sx={{
                    maxWidth: 720,
                    mx: 'auto',
                    mt: 7, mb: 5,
                    px: { xs: 2, md: 6 },
                    py: { xs: 4, md: 6 },
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.93)',
                    boxShadow: '0 8px 32px 0 rgba(102,126,234,0.23)',
                    backdropFilter: 'blur(15px)',
                    position: 'relative'
                }}>
                    {/* Title Banner */}
                    <Box sx={{ textAlign: 'center' }}>
                        <HelpOutlineIcon
                            color="secondary"
                            sx={{ fontSize: 52, mb: -1, animation: 'float 2s infinite alternate' }}
                        />
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 'bold',
                                color: '#764ba2',
                                letterSpacing: 1,
                                mb: 1,
                                mt: 1,
                                fontFamily: 'Poppins, Arial, sans-serif'
                            }}
                        >
                            {t('needHelp')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                            {t('supportTeam')} <FavoriteIcon color="error" sx={{ verticalAlign: 'text-bottom' }} />
                        </Typography>
                    </Box>
                    {/* Animated icons row */}
                    <Grid container justifyContent="center" spacing={3} sx={{ mb: 2 }}>
                        <Grid item>
                            <SupportAgentIcon sx={{ fontSize: 34, color: '#667eea', opacity: 0.7, animation: 'bounce 2s infinite' }} />
                        </Grid>
                        <Grid item>
                            <EmailIcon sx={{ fontSize: 34, color: '#764ba2', opacity: 0.7, animation: 'bounce 2.2s infinite' }} />
                        </Grid>
                        <Grid item>
                            <WhatsAppIcon sx={{ fontSize: 34, color: '#25d366', opacity: 0.7, animation: 'bounce 2.3s infinite' }} />
                        </Grid>
                    </Grid>
                    {/* Contact Buttons */}
                    <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                        <Grid item>
                            <MuiLink href="mailto:2023aspire194@gmail.com" target="_blank" underline="none">
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        background: 'linear-gradient(120deg, #667eea 30%, #764ba2 70%)',
                                        color: '#fff', px: 6, py: 2, borderRadius: 5,
                                        fontWeight: 'bold', fontSize: 18,
                                        boxShadow: 3,
                                        textTransform: 'none',
                                        '&:hover': { background: '#764ba2', transform: 'scale(1.05)' }
                                    }}
                                    startIcon={<EmailIcon />}
                                >
                                    {t('emailSupport')}
                                </Button>
                            </MuiLink>
                        </Grid>
                        <Grid item>
                            <MuiLink href="https://wa.me/918601860318" target="_blank" underline="none">
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        color: '#764ba2', border: '2px solid #667eea',
                                        px: 6, py: 2, borderRadius: 5, fontWeight: 'bold', fontSize: 18,
                                        background: '#fff',
                                        '&:hover': { background: '#764ba2', color: '#fff', borderColor: '#667eea', transform: 'scale(1.05)' }
                                    }}
                                    startIcon={<WhatsAppIcon />}
                                >
                                    {t('whatsApp')}
                                </Button>
                            </MuiLink>
                        </Grid>
                    </Grid>
                    {/* FAQ Card */}
                    <Box sx={{ background: '#f8f6ff', borderRadius: 4, p: 3, boxShadow: 1, mb: 4, mt: 2 }}>
                        <Typography variant="h5" sx={{ color: '#667eea', fontWeight: 'bold', mb: 1 }}>
                            {t('frequentlyAskedQuestions')}
                        </Typography>
                        <Box>
                            <Typography>
                                <b>{t('howDoIBook')}</b>&nbsp;
                                <span style={{ color: '#764ba2' }}>{t('chooseService')}</span>
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                <b>{t('howToResetPassword')}</b>&nbsp;
                                <span style={{ color: '#764ba2' }}>{t('openProfile')}</span>
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                <b>{t('providerAdminHelp')}</b>&nbsp;
                                <span style={{ color: '#764ba2' }}>{t('contactTeam')}</span>
                            </Typography>
                        </Box>
                    </Box>
                    {/* Feedback Form */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 350, mx: 'auto', mt: 1 }}>
                        <Typography variant="h5" sx={{ color: '#764ba2', fontWeight: 'bold', mb: 1 }}>
                            {t('sendUsQuery')}
                        </Typography>
                        <TextField label={t('yourEmail')} color="secondary" value={queryEmail} onChange={e => setQueryEmail(e.target.value)} />
                        <TextField label={t('message')} multiline rows={3} color="secondary" value={queryMsg} onChange={e => setQueryMsg(e.target.value)} />
                        <Button
                            variant="contained" color="secondary"
                            sx={{
                                alignSelf: "flex-end", fontWeight: 'bold', borderRadius: 3, px: 4,
                                background: 'linear-gradient(120deg, #764ba2 20%, #667eea 80%)',
                                boxShadow: 2,
                                '&:hover': { background: '#667eea' },
                            }}
                            onClick={handleSend}
                            disabled={sending}
                        >
                            {sending ? t('sending') : t('send')}
                        </Button>
                        {sent && (
                            <Typography sx={{ color: '#009688', mt: 0.5 }}>
                                {t('successSent')}
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="body2" align="center" sx={{ mt: 4, color: '#888' }}>
                        {t('teamReplies')}
                    </Typography>
                </Paper>
                {/* Custom simple keyframes for bounce/float animation */}
                <style>{`
        @keyframes bounce { 0%{transform:translateY(0);} 60%{transform:translateY(-8px);} 100%{transform:translateY(0);} }
        @keyframes float { 0%{transform:translateY(0);} 100%{transform:translateY(-12px);} }
      `}</style>
            </Box>
        </>
    );

}
export default Help;
